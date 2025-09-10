import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { AdvancedOrdersTable } from './advanced-orders-table'
import { prisma } from '@/lib/prisma'

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true
          }
        },
        orderItems: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            price: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Convert dates to strings and null to undefined to match interface
    return orders.map(order => ({
      ...order,
      createdAt: order.createdAt.toISOString(),
      contactPhone: order.contactPhone === null ? undefined : order.contactPhone,
      deliveryAddress: order.deliveryAddress === null ? undefined : order.deliveryAddress,
      user: {
        ...order.user,
        firstName: order.user.firstName === null ? undefined : order.user.firstName,
        lastName: order.user.lastName === null ? undefined : order.user.lastName
      }
    }))
  } catch (error) {
    console.error('Error fetching orders:', error)
    return []
  }
}

export default async function AdminOrdersPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/')
  }

  // Временно получаем роль из базы данных
  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || user.role === 'USER') {
    redirect('/')
  }

  const orders = await getOrders()

  return (
    <AdminLayout userRole={user.role}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Управление заказами</h1>
          <p className="text-gray-600 mt-2">
            Просмотр и управление всеми заказами
          </p>
        </div>

        <AdvancedOrdersTable orders={orders} userRole={user.role} />
      </div>
    </AdminLayout>
  )
}