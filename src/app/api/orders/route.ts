import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notifyNewOrder } from '@/lib/telegram-bot'

// GET - получить заказы пользователя
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Требуется авторизация' },
        { status: 401 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id
      },
      include: {
        orderItems: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error('Ошибка получения заказов:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

// POST - создать новый заказ
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
    const { contactEmail, contactPhone, deliveryAddress, items } = body

    if (!contactEmail || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      )
    }

    // Получаем данные о товарах из корзины пользователя
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: session.user.id,
        productId: {
          in: items.map((item: any) => item.productId)
        }
      }
    })

    if (cartItems.length === 0) {
      return NextResponse.json(
        { error: 'Корзина пуста' },
        { status: 400 }
      )
    }

    // Получаем данные о товарах из базы данных
    let products: any[] = []
    try {
      products = await prisma.product.findMany({
        where: {
          id: {
            in: items.map((item: any) => item.productId)
          }
        }
      })
    } catch (error) {
      console.log('Products table not found, using fallback data')
      // Fallback к данным из data-client если таблица товаров еще не создана
      const { getProducts } = await import('@/lib/data-client')
      products = getProducts()
    }

    const totalAmount = items.reduce((sum: number, item: any) => {
      const product = products.find((p: any) => p.id === item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)

    // Генерируем номер заказа
    const orderNumber = `ORD-${Date.now()}`

    // Создаем заказ в транзакции
    const order = await prisma.$transaction(async (tx) => {
      // Создаем заказ
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          totalAmount,
          contactEmail,
          contactPhone: contactPhone || null,
          deliveryAddress: deliveryAddress || null,
        }
      })

      // Добавляем товары в заказ
      const orderItems = await Promise.all(
        items.map((item: any) => {
          const product = products.find((p: any) => p.id === item.productId)
          if (!product) throw new Error(`Товар ${item.productId} не найден`)

          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              productName: product.name,
              productCategories: product.categories || [],
              productArticle: product.article || product.id,
            }
          })
        })
      )

      // Очищаем корзину пользователя
      await tx.cartItem.deleteMany({
        where: {
          userId: session.user.id
        }
      })

      return { ...newOrder, orderItems }
    })

    // Send Telegram notification
    try {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, firstName: true, lastName: true },
      });

      await notifyNewOrder({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        userEmail: user?.email || session.user.email,
        userName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : undefined,
        itemsCount: order.orderItems.length,
        items: order.orderItems.map(item => ({
          name: item.productName,
          article: item.productArticle,
          quantity: item.quantity,
          price: item.price,
        })),
        contactPhone: order.contactPhone || undefined,
        deliveryAddress: order.deliveryAddress || undefined,
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error('Ошибка создания заказа:', error)
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}