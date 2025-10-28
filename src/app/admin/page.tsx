import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { 
  ShoppingCart, 
  Users, 
  Package, 
  TrendingUp,
  UserPlus,
  DollarSign,
  Star,
  Activity
} from 'lucide-react'
import { DashboardCharts } from '@/components/admin/dashboard-charts'

async function getStats() {
  try {
    // Дата неделю назад
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    
    const [
      orderCount, 
      userCount, 
      productCount, 
      recentOrders,
      newUsersThisWeek,
      revenueData,
      popularProducts,
      dailyOrders
    ] = await Promise.all([
      // Основные счетчики
      prisma.order.count(),
      prisma.user.count(),
      prisma.product.count(),
      
      // Последние заказы
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true }
          }
        }
      }),

      // Новые пользователи за неделю
      prisma.user.count({
        where: {
          createdAt: {
            gte: oneWeekAgo
          }
        }
      }),

      // Доходы по дням за неделю
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', "createdAt") as date,
          SUM("totalAmount")::float as revenue,
          COUNT(*)::int as orders
        FROM "orders" 
        WHERE "createdAt" >= ${oneWeekAgo}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `,

      // Популярные товары
      prisma.orderItem.groupBy({
        by: ['productName', 'productCategory'],
        _sum: {
          quantity: true
        },
        orderBy: {
          _sum: {
            quantity: 'desc'
          }
        },
        take: 5
      }),

      // Заказы по дням за неделю
      prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', "createdAt") as date,
          COUNT(*)::int as count
        FROM "orders" 
        WHERE "createdAt" >= ${oneWeekAgo}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY date ASC
      `
    ])

    const totalRevenue = await prisma.order.aggregate({
      _sum: { totalAmount: true }
    })

    // Создаем массив всех 7 дней для графиков
    const generateLast7Days = () => {
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
        days.push(date)
      }
      return days
    }

    const last7Days = generateLast7Days()

    // Создаем карты данных по датам для быстрого поиска
    const revenueMap = new Map()
    const ordersMap = new Map()

    ;(revenueData as any[]).forEach((item: any) => {
      const dateKey = new Date(item.date).toDateString()
      revenueMap.set(dateKey, {
        revenue: Number(item.revenue) || 0,
        orders: Number(item.orders) || 0
      })
    })

    ;(dailyOrders as any[]).forEach((item: any) => {
      const dateKey = new Date(item.date).toDateString()
      ordersMap.set(dateKey, Number(item.count) || 0)
    })

    // Форматирование данных для графиков с заполнением пустых дней
    const chartData = last7Days.map(date => {
      const dateKey = date.toDateString()
      const dateLabel = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      const data = revenueMap.get(dateKey) || { revenue: 0, orders: 0 }
      
      return {
        date: dateLabel,
        revenue: data.revenue,
        orders: data.orders
      }
    })

    const orderChartData = last7Days.map(date => {
      const dateKey = date.toDateString()
      const dateLabel = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
      const orders = ordersMap.get(dateKey) || 0
      
      return {
        date: dateLabel,
        orders: orders
      }
    })


    return {
      orderCount,
      userCount,
      productCount,
      newUsersThisWeek,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
      recentOrders,
      chartData,
      orderChartData,
      popularProducts: popularProducts.map(p => ({
        name: p.productName,
        category: p.productCategory,
        quantity: p._sum.quantity || 0
      }))
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    return {
      orderCount: 0,
      userCount: 0,
      productCount: 0,
      newUsersThisWeek: 0,
      totalRevenue: 0,
      recentOrders: [],
      chartData: [],
      orderChartData: [],
      popularProducts: []
    }
  }
}

export default async function AdminDashboard() {
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

  const stats = await getStats()

  return (
    <AdminLayout userRole={user.role}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Админ панель ЭкоСфера</h1>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Общий доход
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₽{stats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +20.1% с прошлого месяца
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Новые пользователи
              </CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.newUsersThisWeek}</div>
              <p className="text-xs text-muted-foreground">
                За последнюю неделю
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Заказы
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.orderCount}</div>
              <p className="text-xs text-muted-foreground">
                +12% с прошлой недели
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Активные пользователи
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.userCount}</div>
              <p className="text-xs text-muted-foreground">
                +8% с прошлого месяца
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <DashboardCharts 
          revenueData={stats.chartData} 
          orderData={stats.orderChartData} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Последние заказы</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{order.user.email}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₽{order.totalAmount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                ))}
                
                {stats.recentOrders.length === 0 && (
                  <p className="text-gray-600 text-center py-4">Заказов пока нет</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Popular Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Популярные товары
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.popularProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-lime-100 rounded-full flex items-center justify-center text-sm font-bold text-forest-600">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className="text-xs text-gray-600">{product.categories.join(', ')}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{product.quantity} шт</p>
                      <p className="text-xs text-gray-600">продано</p>
                    </div>
                  </div>
                ))}
                
                {stats.popularProducts.length === 0 && (
                  <p className="text-gray-600 text-center py-4">Нет данных о продажах</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}