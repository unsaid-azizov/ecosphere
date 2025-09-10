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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { OrderStatus, UserRole } from '@prisma/client'
import { Search, Eye, Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react'

interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  totalAmount: number
  createdAt: string
  contactEmail: string
  contactPhone?: string
  deliveryAddress?: string
  user: {
    email: string
    firstName?: string
    lastName?: string
  }
  orderItems: Array<{
    id: string
    productName: string
    quantity: number
    price: number
  }>
}

interface AdvancedOrdersTableProps {
  orders: Order[]
  userRole: UserRole
}

const statusLabels = {
  PENDING: 'Ожидает обработки',
  CONFIRMED: 'Подтвержден',
  PROCESSING: 'В обработке',
  SHIPPED: 'Отправлен',
  DELIVERED: 'Доставлен',
  CANCELLED: 'Отменен'
}

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  CONFIRMED: 'bg-blue-100 text-blue-800',
  PROCESSING: 'bg-purple-100 text-purple-800',
  SHIPPED: 'bg-orange-100 text-orange-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800'
}

const statusIcons = {
  PENDING: Clock,
  CONFIRMED: CheckCircle,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle
}

export function AdvancedOrdersTable({ orders, userRole }: AdvancedOrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)

  // Фильтрация заказов
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user.firstName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (userRole !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        window.location.reload()
      } else {
        alert('Ошибка при изменении статуса')
      }
    } catch (error) {
      console.error('Error updating status:', error)
      alert('Ошибка при изменении статуса')
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDialogOpen(true)
  }

  const getTotalItemsCount = (order: Order) => {
    return order.orderItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Ожидают обработки</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'PENDING').length}
                </p>
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
                <p className="text-sm font-medium text-gray-500">В обработке</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'PROCESSING').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Truck className="h-8 w-8 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Отправлено</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'SHIPPED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Доставлено</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'DELIVERED').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры и поиск</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Поиск по номеру заказа, email или имени</Label>
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
              <Label htmlFor="status-filter">Фильтр по статусу</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Все статусы" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все статусы</SelectItem>
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <SelectItem key={status} value={status}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Заказы ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Номер заказа</TableHead>
                  <TableHead>Клиент</TableHead>
                  <TableHead>Товары</TableHead>
                  <TableHead>Сумма</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>Дата</TableHead>
                  <TableHead className="text-right">Действия</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status]
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {order.user.firstName && order.user.lastName 
                              ? `${order.user.firstName} ${order.user.lastName}` 
                              : order.user.email}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.contactEmail}
                          </div>
                          {order.contactPhone && (
                            <div className="text-sm text-muted-foreground">
                              {order.contactPhone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{getTotalItemsCount(order)}</span>
                          <span className="text-sm text-muted-foreground">
                            ({order.orderItems.length} поз.)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          ₽{order.totalAmount.toLocaleString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {userRole === 'ADMIN' ? (
                            <Select 
                              value={order.status} 
                              onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-44 min-w-max">
                                <div className="flex items-center gap-2">
                                  <StatusIcon className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate text-sm">
                                    {statusLabels[order.status]}
                                  </span>
                                </div>
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(statusLabels).map(([status, label]) => {
                                  const Icon = statusIcons[status as OrderStatus]
                                  return (
                                    <SelectItem key={status} value={status}>
                                      <div className="flex items-center gap-2">
                                        <Icon className="h-3 w-3" />
                                        {label}
                                      </div>
                                    </SelectItem>
                                  )
                                })}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge className={`${statusColors[order.status]} max-w-full`}>
                              <StatusIcon className="h-3 w-3 mr-1 flex-shrink-0" />
                              <span className="truncate text-sm">
                                {statusLabels[order.status]}
                              </span>
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(order.createdAt).toLocaleTimeString('ru-RU')}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openOrderDetails(order)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
            
            {filteredOrders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Заказы не найдены</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Заказ {selectedOrder?.orderNumber}
            </DialogTitle>
            <DialogDescription>
              Детальная информация о заказе
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Информация о заказе</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Сумма:</span>
                      <span className="font-medium">₽{selectedOrder.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Дата:</span>
                      <span>{new Date(selectedOrder.createdAt).toLocaleString('ru-RU')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Статус:</span>
                      <Badge className={statusColors[selectedOrder.status]}>
                        {statusLabels[selectedOrder.status]}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Контакты</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Email: </span>
                      <span>{selectedOrder.contactEmail}</span>
                    </div>
                    {selectedOrder.contactPhone && (
                      <div>
                        <span className="text-muted-foreground">Телефон: </span>
                        <span>{selectedOrder.contactPhone}</span>
                      </div>
                    )}
                    {selectedOrder.deliveryAddress && (
                      <div>
                        <span className="text-muted-foreground">Адрес: </span>
                        <span>{selectedOrder.deliveryAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <h4 className="font-medium">Товары ({selectedOrder.orderItems.length})</h4>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Товар</TableHead>
                        <TableHead className="text-center">Кол-во</TableHead>
                        <TableHead className="text-right">Цена</TableHead>
                        <TableHead className="text-right">Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {item.productName}
                          </TableCell>
                          <TableCell className="text-center">
                            {item.quantity} шт
                          </TableCell>
                          <TableCell className="text-right">
                            ₽{item.price.toLocaleString()}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            ₽{(item.price * item.quantity).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}