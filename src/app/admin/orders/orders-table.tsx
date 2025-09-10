'use client'

import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Eye } from 'lucide-react'
import { OrderStatus, UserRole } from '@prisma/client'

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

interface OrdersTableProps {
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

export function OrdersTable({ orders, userRole }: OrdersTableProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('ALL')
  
  const filteredOrders = orders.filter(order => 
    statusFilter === 'ALL' || order.status === statusFilter
  )

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    if (userRole !== 'ADMIN') return
    
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      
      if (response.ok) {
        // Refresh page or update state
        window.location.reload()
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Фильтры</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Статус заказа" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Все статусы</SelectItem>
                {Object.entries(statusLabels).map(([status, label]) => (
                  <SelectItem key={status} value={status}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <div className="grid gap-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.user.firstName && order.user.lastName 
                      ? `${order.user.firstName} ${order.user.lastName}` 
                      : order.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={statusColors[order.status]}>
                    {statusLabels[order.status]}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedOrder(selectedOrder?.id === order.id ? null : order)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {selectedOrder?.id === order.id ? 'Скрыть' : 'Детали'}
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            {selectedOrder?.id === order.id && (
              <CardContent className="pt-0 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Order Details */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Информация о заказе</h4>
                      <div className="space-y-1 text-sm">
                        <p><strong>Сумма:</strong> ₽{order.totalAmount.toLocaleString()}</p>
                        <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleString('ru-RU')}</p>
                        <p><strong>Email:</strong> {order.contactEmail}</p>
                        {order.contactPhone && (
                          <p><strong>Телефон:</strong> {order.contactPhone}</p>
                        )}
                        {order.deliveryAddress && (
                          <p><strong>Адрес:</strong> {order.deliveryAddress}</p>
                        )}
                      </div>
                    </div>

                    {/* Status Update */}
                    {userRole === 'ADMIN' && (
                      <div>
                        <h4 className="font-medium mb-2">Изменить статус</h4>
                        <Select 
                          value={order.status} 
                          onValueChange={(value: OrderStatus) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabels).map(([status, label]) => (
                              <SelectItem key={status} value={status}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <h4 className="font-medium mb-2">Товары ({order.orderItems.length})</h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-sm text-gray-600">{item.quantity} шт × ₽{item.price.toLocaleString()}</p>
                          </div>
                          <span className="font-medium">₽{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
        
        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-600">Заказов не найдено</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}