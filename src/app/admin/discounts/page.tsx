import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminLayout } from '@/components/admin-layout'
import DiscountsManagement from './discounts-management'

export default async function DiscountsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/api/auth/signin')
  }

  const currentUser = await prisma.user.findUnique({
    where: { email: session.user.email! },
    select: { role: true }
  })

  if (!currentUser || currentUser.role !== 'ADMIN') {
    redirect('/admin')
  }

  // Get all users for discount assignment
  const usersFromDb = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      userType: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  // Convert null to undefined to match TypeScript interface
  const users = usersFromDb.map(user => ({
    ...user,
    firstName: user.firstName === null ? undefined : user.firstName,
    lastName: user.lastName === null ? undefined : user.lastName
  }))

  // Get all products for product-specific discounts
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      article: true
    },
    orderBy: {
      name: 'asc'
    }
  })

  // Get unique categories
  const categories = Array.from(new Set(products.map(p => p.category))).sort()

  return (
    <AdminLayout userRole={currentUser.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление скидками</h1>
          <p className="text-gray-600 mt-2">
            Создавайте и управляйте персональными скидками для клиентов
          </p>
        </div>

        <DiscountsManagement 
          users={users}
          products={products}
          categories={categories}
        />
      </div>
    </AdminLayout>
  )
}