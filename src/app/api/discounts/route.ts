import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - получить скидки для пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    // Получаем общие скидки на товары
    const productDiscounts = await prisma.productDiscount.findMany({
      where: {
        isActive: true,
        OR: [
          { validUntil: null },
          { validUntil: { gt: new Date() } }
        ]
      }
    })

    // Получаем специальные цены для пользователя
    const userSpecialPrices = await prisma.userSpecialPrice.findMany({
      where: {
        userId: session.user.id
      }
    })

    // Получаем данные пользователя для определения скидки по типу
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        discountPercent: true,
        isVip: true,
        userType: true
      }
    })

    return NextResponse.json({
      productDiscounts,
      userSpecialPrices,
      userDiscount: user?.discountPercent || 0,
      isVip: user?.isVip || false,
      userType: user?.userType
    })
  } catch (error) {
    console.error('Ошибка получения скидок:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - установить специальную цену для пользователя (только для администраторов)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    // В будущем здесь можно добавить проверку на права администратора
    
    const body = await request.json()
    const { userId, productId, price } = body

    if (!userId || !productId || !price) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    const specialPrice = await prisma.userSpecialPrice.upsert({
      where: {
        userId_productId: {
          userId,
          productId
        }
      },
      update: {
        price
      },
      create: {
        userId,
        productId,
        price
      }
    })

    return NextResponse.json(specialPrice)
  } catch (error) {
    console.error('Ошибка установки специальной цены:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}