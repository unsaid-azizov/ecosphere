import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
      where: { email: session.user.email }
    })

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    const { discountPercent } = await request.json()
    
    // Validate discount
    if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 99) {
      return NextResponse.json(
        { error: 'Скидка должна быть числом от 0 до 99' },
        { status: 400 }
      )
    }

    // Update user discount
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { 
        discountPercent,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        discountPercent: true,
        firstName: true,
        lastName: true
      }
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error updating user discount:', error)
    
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