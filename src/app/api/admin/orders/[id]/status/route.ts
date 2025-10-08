import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { notifyOrderStatusChange } from '@/lib/telegram-bot'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check admin permissions
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
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    const { status } = await request.json()
    
    // Validate status
    const validStatuses: OrderStatus[] = [
      'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'
    ]
    
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Недопустимый статус заказа' },
        { status: 400 }
      )
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          }
        }
      }
    })

    // Send Telegram notification to user and admins
    try {
      await notifyOrderStatusChange({
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        userId: updatedOrder.userId,
        userEmail: updatedOrder.user.email,
        userName: updatedOrder.user.firstName && updatedOrder.user.lastName
          ? `${updatedOrder.user.firstName} ${updatedOrder.user.lastName}`
          : undefined,
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error('Error updating order status:', error)
    
    if (error instanceof Error && error.message.includes('Access denied')) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}