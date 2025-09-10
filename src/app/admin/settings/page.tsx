import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { SettingsContent } from './settings-content'
import { prisma } from '@/lib/prisma'

async function getSystemStats() {
  try {
    const [
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue,
      adminUsers,
      managerUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.order.count(),
      prisma.product.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true }
      }),
      prisma.user.count({ where: { role: 'ADMIN' } }),
      prisma.user.count({ where: { role: 'MANAGER' } })
    ])

    return {
      totalUsers,
      totalOrders,
      totalProducts,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      adminUsers,
      managerUsers,
      regularUsers: totalUsers - adminUsers - managerUsers
    }
  } catch (error) {
    console.error('Error fetching system stats:', error)
    return {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalRevenue: 0,
      adminUsers: 0,
      managerUsers: 0,
      regularUsers: 0
    }
  }
}

export default async function AdminSettingsPage() {
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

  const stats = await getSystemStats()

  // Convert null to undefined to match interface
  const currentUser = {
    ...user,
    firstName: user.firstName === null ? undefined : user.firstName,
    lastName: user.lastName === null ? undefined : user.lastName,
    phone: user.phone === null ? undefined : user.phone,
    ipName: user.ipName === null ? undefined : user.ipName,
    companyName: user.companyName === null ? undefined : user.companyName,
    legalAddress: user.legalAddress === null ? undefined : user.legalAddress,
    inn: user.inn === null ? undefined : user.inn,
    kpp: user.kpp === null ? undefined : user.kpp
  }

  return (
    <AdminLayout userRole={user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Настройки системы</h1>
          <p className="text-gray-600 mt-2">
            Управление настройками и системной информацией
          </p>
        </div>

        <SettingsContent stats={stats} currentUser={currentUser} />
      </div>
    </AdminLayout>
  )
}