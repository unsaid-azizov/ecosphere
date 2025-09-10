import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { AdvancedUsersTable } from './advanced-users-table'
import { prisma } from '@/lib/prisma'

async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        _count: {
          select: {
            orders: true,
            favorites: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert null to undefined and dates to strings to match interface
    return users.map(user => ({
      ...user,
      firstName: user.firstName === null ? undefined : user.firstName,
      lastName: user.lastName === null ? undefined : user.lastName,
      phone: user.phone === null ? undefined : user.phone,
      ipName: user.ipName === null ? undefined : user.ipName,
      companyName: user.companyName === null ? undefined : user.companyName,
      legalAddress: user.legalAddress === null ? undefined : user.legalAddress,
      inn: user.inn === null ? undefined : user.inn,
      kpp: user.kpp === null ? undefined : user.kpp,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString()
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  // Временно получаем роль из базы данных
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const users = await getUsers()

  return (
    <AdminLayout userRole={user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление пользователями</h1>
          <p className="text-gray-600 mt-2">
            Просмотр и управление пользователями системы
          </p>
        </div>

        <AdvancedUsersTable users={users} currentUserRole={user.role} />
      </div>
    </AdminLayout>
  )
}