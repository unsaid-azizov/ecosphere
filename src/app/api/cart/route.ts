import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - получить корзину пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json([])
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(cartItems)
  } catch (error) {
    console.error('Ошибка получения корзины:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - добавить товар в корзину
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity = 1 } = body

    if (!productId) {
      return NextResponse.json(
        { error: 'ID товара обязателен' },
        { status: 400 }
      )
    }

    // Проверяем, есть ли уже товар в корзине
    const existingItem = await prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    let cartItem
    if (existingItem) {
      // Обновляем количество
      cartItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        },
        data: {
          quantity: existingItem.quantity + quantity
        }
      })
    } else {
      // Создаем новый элемент корзины
      cartItem = await prisma.cartItem.create({
        data: {
          userId: session.user.id,
          productId,
          quantity
        }
      })
    }

    return NextResponse.json(cartItem)
  } catch (error) {
    console.error('Ошибка добавления в корзину:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// PUT - обновить количество товара в корзине
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { productId, quantity } = body

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'ID товара и количество обязательны' },
        { status: 400 }
      )
    }

    if (quantity <= 0) {
      // Удаляем товар из корзины
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        }
      })
      return NextResponse.json({ deleted: true })
    } else {
      // Обновляем количество
      const cartItem = await prisma.cartItem.update({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        },
        data: {
          quantity
        }
      })
      return NextResponse.json(cartItem)
    }
  } catch (error) {
    console.error('Ошибка обновления корзины:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// DELETE - очистить корзину
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (productId) {
      // Удаляем конкретный товар
      await prisma.cartItem.delete({
        where: {
          userId_productId: {
            userId: session.user.id,
            productId
          }
        }
      })
    } else {
      // Очищаем всю корзину
      await prisma.cartItem.deleteMany({
        where: {
          userId: session.user.id
        }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Ошибка удаления из корзины:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}