import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { ProductsTable } from './products-table'
import { prisma } from '@/lib/prisma'

async function getProducts(limit: number = 50, offset: number = 0) {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    // Convert null to undefined and dates to strings to match interface
    return products.map(product => ({
      ...product,
      description: product.description === null ? undefined : product.description,
      categories: product.categories || [], // Ensure categories is always an array
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

async function getTotalProductsCount() {
  try {
    return await prisma.product.count()
  } catch (error) {
    console.error('Error fetching products count:', error)
    return 0
  }
}

async function getProductStats() {
  try {
    const [totalProducts, availableProducts, lowStockProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { isAvailable: true } }),
      prisma.product.count({ where: { stockQuantity: { lte: 5 } } })
    ])

    return {
      totalProducts,
      availableProducts,
      lowStockProducts
    }
  } catch (error) {
    console.error('Error fetching product stats:', error)
    return {
      totalProducts: 0,
      availableProducts: 0,
      lowStockProducts: 0
    }
  }
}

export default async function AdminProductsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  // Проверяем роль пользователя
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const [products, stats, totalCount] = await Promise.all([
    getProducts(50, 0), // Загружаем первые 50 продуктов
    getProductStats(),
    getTotalProductsCount()
  ])

  return (
    <AdminLayout userRole={user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление товарами</h1>
          <p className="text-gray-600 mt-2">
            Просмотр и управление каталогом товаров ({totalCount} товаров)
          </p>
        </div>

        <ProductsTable 
          initialProducts={products} 
          stats={stats} 
          totalCount={totalCount}
        />
      </div>
    </AdminLayout>
  )
}