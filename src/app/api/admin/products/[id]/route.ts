import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ImageCleanup } from '@/lib/image-cleanup'

interface RouteParams {
  params: {
    id: string
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }
    
    const data = await request.json()
    const {
      article,
      name,
      description,
      price,
      category,
      stockQuantity,
      isAvailable,
      images
    } = data

    // Validation
    if (!article || !name || !price || !category) {
      return NextResponse.json(
        { error: 'Обязательные поля: артикул, название, цена, категория' },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Check if article is being changed and if it conflicts with another product
    if (article !== existingProduct.article) {
      const articleConflict = await prisma.product.findFirst({
        where: { 
          OR: [
            { id: article.trim() },
            { article: article.trim() }
          ],
          id: { not: params.id }
        }
      })

      if (articleConflict) {
        return NextResponse.json(
          { error: 'Товар с таким артикулом уже существует' },
          { status: 409 }
        )
      }
    }

    // Clean up old images that are no longer used
    if (existingProduct.images && images) {
      await ImageCleanup.cleanupOldImages(existingProduct.images, images)
    }

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        article: article.trim(),
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        category: category.trim(),
        stockQuantity: parseInt(stockQuantity) || 0,
        isAvailable: isAvailable !== false,
        images: images || [],
        updatedAt: new Date()
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Error updating product:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
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

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Check if product is referenced in any orders
    const orderItems = await prisma.orderItem.findFirst({
      where: { productId: params.id }
    })

    if (orderItems) {
      return NextResponse.json(
        { error: 'Нельзя удалить товар, который есть в заказах. Можно отключить его доступность.' },
        { status: 409 }
      )
    }

    // Delete product images first
    if (existingProduct.images && existingProduct.images.length > 0) {
      await ImageCleanup.deleteProductImages(existingProduct.images)
    }

    // Delete product
    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Товар успешно удален' })
  } catch (error) {
    console.error('Error deleting product:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
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

    if (!currentUser || (currentUser.role !== 'ADMIN' && currentUser.role !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}