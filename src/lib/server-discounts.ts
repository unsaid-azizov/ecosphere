import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export interface ServerDiscountResult {
  productId: string
  discountPercent: number
  discountName?: string
}

export async function getServerDiscounts(
  products: Array<{ id: string; price: number; categories: string[] }>
): Promise<ServerDiscountResult[]> {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return []
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!currentUser) {
      return []
    }

    const results: ServerDiscountResult[] = []
    const now = new Date()

    for (const product of products) {
      // Build category discount conditions - check if discount category is in product's categories
      const categoryDiscountConditions = product.categories.map(cat => ({
        discountType: 'CATEGORY' as const,
        category: cat
      }))

      // Ищем применимые скидки в порядке приоритета
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
                  productId: product.id
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

      if (finalDiscountPercent > 0) {
        results.push({
          productId: product.id,
          discountPercent: finalDiscountPercent,
          discountName
        })
      }
    }

    return results
  } catch (error) {
    console.error('Ошибка получения серверных скидок:', error)
    return []
  }
}