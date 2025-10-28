'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Pencil, Trash2, Clock, User, Tag, Package, Globe } from 'lucide-react'
import CreateDiscountDialog from './create-discount-dialog'
import EditDiscountDialog from './edit-discount-dialog'
import DeleteDiscountDialog from './delete-discount-dialog'

interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  userType: string
}

interface Product {
  id: string
  name: string
  categories: string[]
  article: string
}

interface PersonalDiscount {
  id: string
  name: string
  description?: string
  userId?: string
  userType?: string
  discountType: 'PRODUCT' | 'CATEGORY' | 'ALL'
  productId?: string
  category?: string
  discountPercent: number
  validFrom: string
  validUntil?: string
  isActive: boolean
  createdAt: string
  user?: {
    id: string
    email: string
    firstName?: string
    lastName?: string
    userType: string
  }
  creator: {
    id: string
    email: string
    firstName?: string
    lastName?: string
  }
}

interface DiscountsManagementProps {
  users: User[]
  products: Product[]
  categories: string[]
}

export default function DiscountsManagement({ 
  users, 
  products, 
  categories 
}: DiscountsManagementProps) {
  const [discounts, setDiscounts] = useState<PersonalDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDiscountId, setEditDiscountId] = useState<string | null>(null)
  const [deleteDiscountId, setDeleteDiscountId] = useState<string | null>(null)

  useEffect(() => {
    fetchDiscounts()
  }, [])

  const fetchDiscounts = async () => {
    try {
      const response = await fetch('/api/admin/discounts')
      if (response.ok) {
        const data = await response.json()
        setDiscounts(data)
      }
    } catch (error) {
      console.error('Ошибка загрузки скидок:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDiscountCreated = () => {
    fetchDiscounts()
    setCreateDialogOpen(false)
  }

  const handleDiscountUpdated = () => {
    fetchDiscounts()
    setEditDiscountId(null)
  }

  const handleDiscountDeleted = () => {
    fetchDiscounts()
    setDeleteDiscountId(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getDiscountTypeIcon = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return <Package className="w-4 h-4" />
      case 'CATEGORY':
        return <Tag className="w-4 h-4" />
      case 'ALL':
        return <Globe className="w-4 h-4" />
      default:
        return null
    }
  }

  const getDiscountTypeText = (type: string) => {
    switch (type) {
      case 'PRODUCT':
        return 'Товар'
      case 'CATEGORY':
        return 'Категория'
      case 'ALL':
        return 'Все товары'
      default:
        return type
    }
  }

  const getUserTypeText = (userType: string | null) => {
    if (!userType) return 'Все'
    switch (userType) {
      case 'INDIVIDUAL':
        return 'Физ. лица'
      case 'IP':
        return 'ИП'
      case 'OOO':
        return 'ООО'
      default:
        return userType
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-lime-600"></div>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Всего скидок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{discounts.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Активных скидок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-lime-600">
                  {discounts.filter(d => d.isActive).length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Персональных скидок
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {discounts.filter(d => d.userId).length}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button 
            onClick={() => setCreateDialogOpen(true)}
            className="bg-lime-600 hover:bg-lime-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Создать скидку
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Список скидок</CardTitle>
        </CardHeader>
        <CardContent>
          {discounts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Скидки не найдены</p>
              <p className="text-sm">Создайте первую скидку для клиентов</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Название</TableHead>
                    <TableHead>Клиент</TableHead>
                    <TableHead>Тип</TableHead>
                    <TableHead>Цель</TableHead>
                    <TableHead>Скидка</TableHead>
                    <TableHead>Период</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead>Действия</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {discounts.map((discount) => (
                    <TableRow key={discount.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{discount.name}</div>
                          {discount.description && (
                            <div className="text-sm text-gray-500 mt-1">
                              {discount.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {discount.user ? (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-400" />
                            <div>
                              <div className="font-medium">
                                {discount.user.firstName && discount.user.lastName
                                  ? `${discount.user.firstName} ${discount.user.lastName}`
                                  : discount.user.email
                                }
                              </div>
                              <div className="text-xs text-gray-500">
                                {getUserTypeText(discount.user.userType)}
                              </div>
                            </div>
                          </div>
                        ) : discount.userType ? (
                          <Badge variant="secondary">
                            {getUserTypeText(discount.userType)}
                          </Badge>
                        ) : (
                          <Badge variant="outline">Все клиенты</Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getDiscountTypeIcon(discount.discountType)}
                          <span>{getDiscountTypeText(discount.discountType)}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {discount.discountType === 'PRODUCT' && discount.productId ? (
                          <div className="text-sm">
                            {products.find(p => p.id === discount.productId)?.name || 'Товар не найден'}
                          </div>
                        ) : discount.discountType === 'CATEGORY' && discount.category ? (
                          <Badge variant="secondary">{discount.category}</Badge>
                        ) : (
                          <span className="text-gray-500">Все товары</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="default" className="bg-lime-600">
                          -{discount.discountPercent}%
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(discount.validFrom)}
                          </div>
                          {discount.validUntil && (
                            <div className="text-gray-500 mt-1">
                              до {formatDate(discount.validUntil)}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant={discount.isActive ? "default" : "secondary"}
                          className={discount.isActive ? "bg-green-600" : ""}
                        >
                          {discount.isActive ? "Активна" : "Неактивна"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditDiscountId(discount.id)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteDiscountId(discount.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <CreateDiscountDialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        onSuccess={handleDiscountCreated}
        users={users}
        products={products}
        categories={categories}
      />

      {editDiscountId && (
        <EditDiscountDialog
          discountId={editDiscountId}
          open={!!editDiscountId}
          onClose={() => setEditDiscountId(null)}
          onSuccess={handleDiscountUpdated}
          users={users}
          products={products}
          categories={categories}
        />
      )}

      {deleteDiscountId && (
        <DeleteDiscountDialog
          discountId={deleteDiscountId}
          open={!!deleteDiscountId}
          onClose={() => setDeleteDiscountId(null)}
          onSuccess={handleDiscountDeleted}
        />
      )}
    </>
  )
}