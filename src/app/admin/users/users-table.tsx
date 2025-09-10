'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@prisma/client'

interface User {
  id: string
  email: string
  role: UserRole
  userType: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt: string
  _count: {
    orders: number
    favorites: number
  }
}

interface UsersTableProps {
  users: User[]
  userRole: UserRole
}

const roleLabels = {
  USER: 'Пользователь',
  MANAGER: 'Менеджер',
  ADMIN: 'Администратор'
}

const roleColors = {
  USER: 'bg-gray-100 text-gray-800',
  MANAGER: 'bg-blue-100 text-blue-800', 
  ADMIN: 'bg-red-100 text-red-800'
}

const userTypeLabels = {
  INDIVIDUAL: 'Физическое лицо',
  IP: 'ИП',
  OOO: 'ООО'
}

export function UsersTable({ users, userRole }: UsersTableProps) {
  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (userRole !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      if (response.ok) {
        // Refresh page or update state
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating role:', error)
    }
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <Card key={user.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.email}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {user.email} • {userTypeLabels[user.userType as keyof typeof userTypeLabels]}
                </p>
                {user.phone && (
                  <p className="text-sm text-gray-600">Телефон: {user.phone}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Badge className={roleColors[user.role]}>
                  {roleLabels[user.role]}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* User Stats */}
              <div>
                <h4 className="font-medium mb-2">Статистика</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Заказов:</strong> {user._count.orders}</p>
                  <p><strong>В избранном:</strong> {user._count.favorites}</p>
                  <p><strong>Регистрация:</strong> {new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                </div>
              </div>

              {/* Role Management */}
              {userRole === 'ADMIN' && (
                <div>
                  <h4 className="font-medium mb-2">Изменить роль</h4>
                  <Select 
                    value={user.role} 
                    onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(roleLabels).map(([role, label]) => (
                        <SelectItem key={role} value={role}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {users.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-600">Пользователей не найдено</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}