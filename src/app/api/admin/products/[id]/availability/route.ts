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
    
    const { isAvailable } = await request.json()
    
    // Validate availability
    if (typeof isAvailable !== 'boolean') {
      return NextResponse.json(
        { error: 'Неверное значение доступности' },
        { status: 400 }
      )
    }

    // Update product availability
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: { 
        isAvailable,
        updatedAt: new Date()
      },
      select: {
        id: true,
        name: true,
        isAvailable: true
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product availability:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}