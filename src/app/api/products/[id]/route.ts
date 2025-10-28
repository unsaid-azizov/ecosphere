import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: {
    id: string;
  };
}

// GET - получить один товар по ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = params;

    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      );
    }

    // Преобразуем в формат, ожидаемый фронтендом
    const formattedProduct = {
      id: product.id,
      article: product.article,
      name: product.name,
      description: product.description || '',
      price: product.price,
      categories: product.categories,
      images: product.images,
      availability: product.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии',
      stockQuantity: product.stockQuantity,
      isAvailable: product.isAvailable
    };

    const response = NextResponse.json(formattedProduct);
    
    // Добавляем заголовки кэширования
    response.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    response.headers.set('CDN-Cache-Control', 'public, max-age=300');
    
    return response;
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    return NextResponse.json(
      { error: 'Ошибка получения товара из базы данных' },
      { status: 500 }
    );
  }
}