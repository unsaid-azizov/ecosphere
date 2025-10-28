import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface DiscountCalculationRequest {
  productId: string
  originalPrice: number
}

interface DiscountCalculationResult {
  productId: string
  originalPrice: number
  discountedPrice: number
  discountPercent: number
  discountName?: string
  savings: number
}

// POST - рассчитать скидку для товаров
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Пользователь не найден' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const products: DiscountCalculationRequest[] = body.products

    if (!products || !Array.isArray(products)) {
      return NextResponse.json(
        { error: 'Неверный формат данных' },
        { status: 400 }
      )
    }

    const results: DiscountCalculationResult[] = []
    
    for (const product of products) {
      const { productId, originalPrice } = product
      
      // Получаем товар для определения категорий
      const productData = await prisma.product.findUnique({
        where: { id: productId },
        select: { categories: true }
      })

      if (!productData) {
        results.push({
          productId,
          originalPrice,
          discountedPrice: originalPrice,
          discountPercent: 0,
          savings: 0
        })
        continue
      }

      // Ищем применимые скидки в порядке приоритета
      const now = new Date()

      // Build category discount conditions - check if discount category is in product's categories
      const categoryDiscountConditions = productData.categories.map(cat => ({
        discountType: 'CATEGORY' as const,
        category: cat
      }))

      const applicableDiscounts = await prisma.personalDiscount.findMany({
        where: {
          isActive: true,
          validFrom: { lte: now },
          OR: [
            { validUntil: null },
            { validUntil: { gte: now } }
          ],
          AND: [
            {
              OR: [
                // Скидка для конкретного пользователя
                { userId: currentUser.id },
                // Скидка для типа пользователей
                {
                  userId: null,
                  userType: currentUser.userType
                },
                // Скидка для всех пользователей
                {
                  userId: null,
                  userType: null
                }
              ]
            },
            {
              OR: [
                // Скидка на конкретный товар
                {
                  discountType: 'PRODUCT',
                  productId: productId
                },
                // Скидка на любую из категорий товара
                ...categoryDiscountConditions,
                // Скидка на все товары
                { discountType: 'ALL' }
              ]
            }
          ]
        },
        orderBy: [
          // Приоритет: индивидуальные скидки > скидки по типу пользователя > общие скидки
          { userId: { sort: 'desc', nulls: 'last' } },
          // Приоритет: товар > категория > все товары
          { discountType: 'desc' },
          // Наибольший процент скидки
          { discountPercent: 'desc' },
          // Более новые скидки
          { createdAt: 'desc' }
        ],
        take: 1 // Берем только лучшую скидку
      })

      let bestDiscount = applicableDiscounts[0]
      let finalDiscountPercent = 0
      let discountName = undefined

      if (bestDiscount) {
        finalDiscountPercent = bestDiscount.discountPercent
        discountName = bestDiscount.name
      }

      // Также учитываем общую скидку пользователя (из поля discountPercent)
      if (currentUser.discountPercent > finalDiscountPercent) {
        finalDiscountPercent = currentUser.discountPercent
        discountName = `Персональная скидка ${currentUser.discountPercent}%`
      }

      const discountedPrice = originalPrice * (1 - finalDiscountPercent / 100)
      const savings = originalPrice - discountedPrice

      results.push({
        productId,
        originalPrice,
        discountedPrice: Math.round(discountedPrice * 100) / 100, // Округляем до копеек
        discountPercent: finalDiscountPercent,
        discountName,
        savings: Math.round(savings * 100) / 100
      })
    }

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Ошибка расчета скидок:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}