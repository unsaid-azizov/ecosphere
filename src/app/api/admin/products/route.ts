import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { revalidatePath } from 'next/cache'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // Check if article already exists
    const existingProduct = await prisma.product.findFirst({
      where: {
        article: article.trim()
      }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Товар с таким артикулом уже существует' },
        { status: 409 }
      )
    }

    // Create new product using article as id for URL consistency
    const newProduct = await prisma.product.create({
      data: {
        id: article.trim(), // Using article as id so URLs work with /product/[article]
        article: article.trim(),
        name: name.trim(),
        description: description?.trim() || '',
        price: parseFloat(price),
        category: category.trim(),
        stockQuantity: parseInt(stockQuantity) || 0,
        isAvailable: isAvailable !== false,
        images: images || []
      }
    })

    // Очищаем кэш для страницы товара и каталога
    revalidatePath('/catalog')
    revalidatePath(`/product/${newProduct.article}`)

    return NextResponse.json({ product: newProduct })
  } catch (error) {
    console.error('Error creating product:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build filters
    const where: any = {}

    if (category && category !== 'all') {
      where.category = category
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { article: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get products with pagination
    const products = await prisma.product.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    })

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where })

    return NextResponse.json({
      products,
      totalCount,
      hasMore: offset + limit < totalCount
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    )
  }
}