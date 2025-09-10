'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { UserRole } from '@prisma/client'
import { Search, Edit, Eye, Percent } from 'lucide-react'

interface User {
  id: string
  email: string
  role: UserRole
  userType: string
  firstName?: string
  lastName?: string
  phone?: string
  createdAt: string
  discountPercent: number
  _count: {
    orders: number
    favorites: number
  }
}

interface AdvancedUsersTableProps {
  users: User[]
  currentUserRole: UserRole
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
  INDIVIDUAL: 'Физ. лицо',
  IP: 'ИП',
  OOO: 'ООО'
}

export function AdvancedUsersTable({ users, currentUserRole }: AdvancedUsersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('ALL')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [discountInput, setDiscountInput] = useState('')
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)

  // Фильтрация пользователей
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter
    
    return matchesSearch && matchesRole
  })

  const updateUserRole = async (userId: string, newRole: UserRole) => {
    if (currentUserRole !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      })
      
      if (response.ok) {
        window.location.reload()
      } else {
        alert('Ошибка при изменении роли')
      }
    } catch (error) {
      console.error('Error updating role:', error)
      alert('Ошибка при изменении роли')
    }
  }

  const updateUserDiscount = async (userId: string, discountPercent: number) => {
    if (currentUserRole !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/admin/users/${userId}/discount`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discountPercent })
      })
      
      if (response.ok) {
        setIsDiscountDialogOpen(false)
        setSelectedUser(null)
        setDiscountInput('')
        window.location.reload()
      } else {
        alert('Ошибка при изменении скидки')
      }
    } catch (error) {
      console.error('Error updating discount:', error)
      alert('Ошибка при изменении скидки')
    }
  }

  const openDiscountDialog = (user: User) => {
    setSelectedUser(user)
    setDiscountInput(user.discountPercent.toString())
    setIsDiscountDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск по email, имени или ID</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Введите для поиска..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="sm:w-48">
              <Label htmlFor="role-filter">Фильтр по роли</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все роли" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все роли</SelectItem>
                  {Object.entries(roleLabels).map(([role, label]) => (
                    <SelectItem key={role} value={role}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Пользователи ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Пользователь</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Роль</TableHead>
                  <TableHead>Заказы</TableHead>
                  <TableHead>Скидка</TableHead>
                  <TableHead>Регистрация</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-xs">
                      {user.id.substring(0, 8)}...
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {user.firstName && user.lastName 
                            ? `${user.firstName} ${user.lastName}` 
                            : user.email}
                        </div>
                        {(user.firstName || user.lastName) && (
                          <div className="text-sm text-muted-foreground">{user.email}</div>
                        )}
                        {user.phone && (
                          <div className="text-sm text-muted-foreground">{user.phone}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {userTypeLabels[user.userType as keyof typeof userTypeLabels]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {currentUserRole === 'ADMIN' ? (
                        <Select 
                          value={user.role} 
                          onValueChange={(value: UserRole) => updateUserRole(user.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(roleLabels).map(([role, label]) => (
                              <SelectItem key={role} value={role}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={roleColors[user.role]}>
                          {roleLabels[user.role]}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-center">
                        <div className="font-medium">{user._count.orders}</div>
                        <div className="text-sm text-muted-foreground">
                          ❤️ {user._count.favorites}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{user.discountPercent}%</span>
                        {currentUserRole === 'ADMIN' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDiscountDialog(user)}
                          >
                            <Percent className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Пользователи не найдены</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Изменить скидку</DialogTitle>
            <DialogDescription>
              Установка персональной скидки для пользователя {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="discount">Процент скидки (0-99)</Label>
              <Input
                id="discount"
                type="number"
                min="0"
                max="99"
                value={discountInput}
                onChange={(e) => setDiscountInput(e.target.value)}
                placeholder="Введите процент скидки"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscountDialogOpen(false)}>
              Отмена
            </Button>
            <Button 
              onClick={() => {
                const discount = parseInt(discountInput) || 0
                if (selectedUser && discount >= 0 && discount <= 99) {
                  updateUserDiscount(selectedUser.id, discount)
                }
              }}
            >
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}