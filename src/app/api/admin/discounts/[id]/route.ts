import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DiscountType, UserType } from '@prisma/client'

// GET - получить конкретную скидку
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const discount = await prisma.personalDiscount.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        },
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    if (!discount) {
      return NextResponse.json(
        { error: 'Скидка не найдена' },
        { status: 404 }
      )
    }

    return NextResponse.json(discount)
  } catch (error) {
    console.error('Ошибка получения скидки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PUT - обновить скидку
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора.' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      userId,
      userType,
      discountType,
      productId,
      category,
      discountPercent,
      validFrom,
      validUntil,
      isActive
    } = body

    // Валидация обязательных полей
    if (!name || !discountType || !discountPercent) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Валидация процента скидки
    if (discountPercent < 1 || discountPercent > 99) {
      return NextResponse.json(
        { error: 'Процент скидки должен быть от 1 до 99' },
        { status: 400 }
      )
    }

    // Валидация типа скидки
    if (!['PRODUCT', 'CATEGORY', 'ALL'].includes(discountType)) {
      return NextResponse.json(
        { error: 'Недопустимый тип скидки' },
        { status: 400 }
      )
    }

    // Валидация специфичных полей для типов скидок
    if (discountType === 'PRODUCT' && !productId) {
      return NextResponse.json(
        { error: 'Для скидки на товар необходимо указать productId' },
        { status: 400 }
      )
    }

    if (discountType === 'CATEGORY' && !category) {
      return NextResponse.json(
        { error: 'Для скидки на категорию необходимо указать category' },
        { status: 400 }
      )
    }

    // Если указан пользователь, проверяем что он существует
    if (userId) {
      const targetUser = await prisma.user.findUnique({
        where: { id: userId }
      })

      if (!targetUser) {
        return NextResponse.json(
          { error: 'Пользователь не найден' },
          { status: 404 }
        )
      }
    }

    // Обновляем скидку
    const discount = await prisma.personalDiscount.update({
      where: { id: params.id },
      data: {
        name,
        description,
        userId: userId || null,
        userType: userType as UserType || null,
        discountType: discountType as DiscountType,
        productId: productId || null,
        category: category || null,
        discountPercent,
        validFrom: new Date(validFrom),
        validUntil: validUntil ? new Date(validUntil) : null,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            userType: true
          }
        },
        creator: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(discount)
  } catch (error) {
    console.error('Ошибка обновления скидки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE - удалить скидку
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email! }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен. Требуются права администратора.' },
        { status: 403 }
      )
    }

    await prisma.personalDiscount.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка удаления скидки:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}