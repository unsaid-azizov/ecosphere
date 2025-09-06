import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - получить все товары из базы данных
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const limit = parseInt(searchParams.get('limit') || '0')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Строим фильтры
    const where: any = {
      isAvailable: true
    }

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

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) where.price.gte = parseFloat(minPrice)
      if (maxPrice) where.price.lte = parseFloat(maxPrice)
    }

    // Получаем товары из базы данных
    const queryOptions: any = {
      where,
      orderBy: {
        id: 'asc' // Сортируем по ID в возрастающем порядке, чтобы соответствовать порядку CSV
      }
    }

    // Добавляем пагинацию если указана
    if (limit > 0) {
      queryOptions.take = limit
      queryOptions.skip = offset
    }

    const products = await prisma.product.findMany(queryOptions)

    // Преобразуем в формат, ожидаемый фронтендом
    const formattedProducts = products.map(product => ({
      id: product.id,
      article: product.article,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      images: product.images,
      availability: product.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии',
      stockQuantity: product.stockQuantity
    }))

    const response = NextResponse.json(formattedProducts)
    
    // Добавляем заголовки кэширования
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
    response.headers.set('CDN-Cache-Control', 'public, max-age=300')
    
    return response
  } catch (error) {
    console.error('Ошибка получения товаров:', error)
    return NextResponse.json(
      { error: 'Ошибка получения товаров из базы данных' },
      { status: 500 }
    )
  }
}

// PUT - обновить количество товара
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, stockQuantity } = body

    if (!productId || stockQuantity === undefined) {
      return NextResponse.json(
        { error: 'Не указан ID товара или количество' },
        { status: 400 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stockQuantity: Math.max(0, stockQuantity),
        isAvailable: stockQuantity > 0
      }
    })

    return NextResponse.json(updatedProduct)
  } catch (error) {
    console.error('Ошибка обновления товара:', error)
    return NextResponse.json(
      { error: 'Ошибка обновления товара' },
      { status: 500 }
    )
  }
}