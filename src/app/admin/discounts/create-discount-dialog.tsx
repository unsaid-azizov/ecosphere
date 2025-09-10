'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

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
  category: string
  article: string
}

interface CreateDiscountDialogProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
  users: User[]
  products: Product[]
  categories: string[]
}

export default function CreateDiscountDialog({
  open,
  onClose,
  onSuccess,
  users,
  products,
  categories
}: CreateDiscountDialogProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    userId: '__all__',
    userType: '__all__',
    discountType: 'ALL' as 'PRODUCT' | 'CATEGORY' | 'ALL',
    productId: '',
    category: '',
    discountPercent: '',
    validFrom: new Date(),
    validUntil: null as Date | null,
    hasEndDate: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        name: formData.name,
        description: formData.description || null,
        userId: formData.userId && formData.userId !== '__all__' ? formData.userId : null,
        userType: formData.userType && formData.userType !== '__all__' ? formData.userType : null,
        discountType: formData.discountType,
        productId: formData.discountType === 'PRODUCT' ? formData.productId : null,
        category: formData.discountType === 'CATEGORY' ? formData.category : null,
        discountPercent: parseInt(formData.discountPercent),
        validFrom: formData.validFrom.toISOString(),
        validUntil: formData.hasEndDate && formData.validUntil 
          ? formData.validUntil.toISOString() 
          : null
      }

      const response = await fetch('/api/admin/discounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Ошибка создания скидки')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Произошла ошибка')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      userId: '__all__',
      userType: '__all__',
      discountType: 'ALL',
      productId: '',
      category: '',
      discountPercent: '',
      validFrom: new Date(),
      validUntil: null,
      hasEndDate: false
    })
    setError('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать новую скидку</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Название скидки *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: VIP скидка для Иванова"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="discountPercent">Процент скидки *</Label>
              <Input
                id="discountPercent"
                type="number"
                min="1"
                max="99"
                value={formData.discountPercent}
                onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                placeholder="15"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Описание</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Дополнительное описание скидки"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Кому применяется скидка</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="userId">Конкретный клиент</Label>
                <Select
                  value={formData.userId}
                  onValueChange={(value) => setFormData({ ...formData, userId: value, userType: value !== '__all__' ? '__all__' : formData.userType })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите клиента" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Все клиенты</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.firstName && user.lastName
                          ? `${user.firstName} ${user.lastName} (${user.email})`
                          : user.email
                        }
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="userType">Тип клиентов</Label>
                <Select
                  value={formData.userType}
                  onValueChange={(value) => setFormData({ ...formData, userType: value })}
                  disabled={formData.userId !== '__all__'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__all__">Все типы</SelectItem>
                    <SelectItem value="INDIVIDUAL">Физические лица</SelectItem>
                    <SelectItem value="IP">ИП</SelectItem>
                    <SelectItem value="OOO">ООО</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">На что применяется скидка</h3>
            
            <div>
              <Label htmlFor="discountType">Тип скидки</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value: 'PRODUCT' | 'CATEGORY' | 'ALL') => 
                  setFormData({ ...formData, discountType: value, productId: '', category: '' })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Все товары</SelectItem>
                  <SelectItem value="CATEGORY">Конкретная категория</SelectItem>
                  <SelectItem value="PRODUCT">Конкретный товар</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.discountType === 'CATEGORY' && (
              <div>
                <Label htmlFor="category">Категория</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {formData.discountType === 'PRODUCT' && (
              <div>
                <Label htmlFor="productId">Товар</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите товар" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} ({product.article})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Период действия</h3>
            
            <div>
              <Label>Дата начала *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(formData.validFrom, 'dd MMMM yyyy', { locale: ru })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.validFrom}
                    onSelect={(date) => date && setFormData({ ...formData, validFrom: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasEndDate"
                checked={formData.hasEndDate}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, hasEndDate: !!checked, validUntil: null })
                }
              />
              <Label htmlFor="hasEndDate">Установить дату окончания</Label>
            </div>

            {formData.hasEndDate && (
              <div>
                <Label>Дата окончания</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validUntil 
                        ? format(formData.validUntil, 'dd MMMM yyyy', { locale: ru })
                        : 'Выберите дату'
                      }
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.validUntil || undefined}
                      onSelect={(date) => setFormData({ ...formData, validUntil: date || null })}
                      disabled={(date) => date < formData.validFrom}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={handleClose}>
              Отмена
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-lime-600 hover:bg-lime-700"
            >
              {loading ? 'Создание...' : 'Создать скидку'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}