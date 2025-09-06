import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getProducts } from '@/lib/data'
import { Product } from '@/types/product'

function generateRandomStock(): number {
  // Generate random stock between 0 and 500
  const stockRanges = [
    { min: 0, max: 50, weight: 0.15 },    // 15% low stock
    { min: 51, max: 150, weight: 0.35 },  // 35% medium stock  
    { min: 151, max: 300, weight: 0.35 }, // 35% good stock
    { min: 301, max: 500, weight: 0.15 }  // 15% high stock
  ]
  
  const random = Math.random()
  let cumulativeWeight = 0
  
  for (const range of stockRanges) {
    cumulativeWeight += range.weight
    if (random <= cumulativeWeight) {
      return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min
    }
  }
  
  return Math.floor(Math.random() * 200) + 50 // fallback
}

// POST - загрузить товары в базу данных
export async function POST(request: NextRequest) {
  try {
    console.log('Загружаем товары из CSV файла...')
    
    // Получаем все товары из CSV файла
    const allProducts = await getProducts()
    console.log(`Найдено ${allProducts.length} товаров в CSV файле`)
    
    // Очищаем существующие товары
    await prisma.product.deleteMany()
    console.log('Существующие товары удалены из базы данных')
    
    console.log('Начинаем загрузку товаров в базу данных...')
    
    // Преобразуем товары для загрузки в базу данных
    const productsToSeed = allProducts.map(product => {
      const stockQuantity = generateRandomStock()
      return {
        id: product.id,
        article: product.article,
        name: product.name,
        description: product.description || '',
        price: product.price,
        category: product.category,
        images: product.images || [],
        stockQuantity,
        isAvailable: stockQuantity > 0
      }
    })

    // Загружаем товары в базу данных батчами по 100 штук
    const batchSize = 100
    let totalCreated = 0
    
    for (let i = 0; i < productsToSeed.length; i += batchSize) {
      const batch = productsToSeed.slice(i, i + batchSize)
      const result = await prisma.product.createMany({
        data: batch,
        skipDuplicates: true
      })
      totalCreated += result.count
      console.log(`Загружено ${totalCreated}/${productsToSeed.length} товаров...`)
    }

    console.log(`Успешно загружено ${totalCreated} товаров в базу данных`)

    return NextResponse.json({
      message: 'Товары успешно загружены в базу данных',
      count: totalCreated,
      totalProducts: allProducts.length
    })
  } catch (error) {
    console.error('Ошибка загрузки товаров:', error)
    return NextResponse.json(
      { error: 'Ошибка загрузки товаров в базу данных', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}