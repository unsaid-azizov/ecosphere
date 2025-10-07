'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Database,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Shield,
  UserCheck,
  Settings,
  Info,
  RefreshCw,
  Download
} from 'lucide-react'

interface SystemStats {
  totalUsers: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  adminUsers: number
  managerUsers: number
  regularUsers: number
}

interface CurrentUser {
  id: string
  email: string
  role: string
  firstName?: string
  lastName?: string
}

interface SettingsContentProps {
  stats: SystemStats
  currentUser: CurrentUser
}

export function SettingsContent({ stats, currentUser }: SettingsContentProps) {
  const handleClearCache = async () => {
    // Placeholder for cache clearing functionality
    alert('Кэш очищен!')
  }

  const handleBackupDatabase = async () => {
    // Placeholder for database backup functionality
    alert('Резервное копирование запущено!')
  }

  const handleExportDatabase = () => {
    // Direct navigation to trigger download
    window.location.href = '/api/admin/export'
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Пользователи</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Заказы</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Package className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Товары</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Доход</p>
                <p className="text-2xl font-bold text-gray-900">₽{stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5" />
              Информация о текущем пользователе
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Email:</span>
                <span className="font-medium">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Роль:</span>
                <Badge className="bg-red-100 text-red-800">
                  {currentUser.role === 'ADMIN' ? 'Администратор' : currentUser.role}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">ID:</span>
                <span className="font-mono text-xs">{currentUser.id.substring(0, 16)}...</span>
              </div>
              {(currentUser.firstName || currentUser.lastName) && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Имя:</span>
                  <span className="font-medium">
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* User Roles Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Распределение ролей
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Администраторы</span>
                </div>
                <span className="font-bold">{stats.adminUsers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Менеджеры</span>
                </div>
                <span className="font-bold">{stats.managerUsers}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Пользователи</span>
                </div>
                <span className="font-bold">{stats.regularUsers}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Системные действия
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium">Обслуживание системы</h4>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleClearCache}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Очистить кэш
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleBackupDatabase}
                >
                  <Database className="h-4 w-4 mr-2" />
                  Резервное копирование БД
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleExportDatabase}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт базы данных (Excel)
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Информация</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  <span>Версия системы: 1.0.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>БД: PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>Framework: Next.js 14</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Быстрые действия</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => window.open('/admin/users', '_blank')}
            >
              <Users className="h-6 w-6" />
              <span>Управление пользователями</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => window.open('/admin/orders', '_blank')}
            >
              <ShoppingCart className="h-6 w-6" />
              <span>Управление заказами</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-20 flex-col gap-2"
              onClick={() => window.open('/admin/products', '_blank')}
            >
              <Package className="h-6 w-6" />
              <span>Управление товарами</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}