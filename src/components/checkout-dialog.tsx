'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useCart } from '@/contexts/cart-context'
import { ShoppingCart, CreditCard, Truck } from 'lucide-react'

interface CheckoutFormData {
  contactEmail: string
  contactPhone: string
  deliveryAddress: string
}

interface CheckoutDialogProps {
  children: React.ReactNode
}

export function CheckoutDialog({ children }: CheckoutDialogProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { cart, clearCart } = useCart()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData>({
    contactEmail: session?.user?.email || '',
    contactPhone: '',
    deliveryAddress: ''
  })

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) {
      router.push('/login')
      return
    }

    setIsLoading(true)
    try {
      const orderItems = cart.items.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          items: orderItems
        }),
      })

      if (response.ok) {
        const order = await response.json()
        // Очищаем корзину после успешного заказа
        await clearCart()
        setOpen(false)
        
        // Показываем успешное сообщение и переходим к заказам
        alert(`Заказ ${order.orderNumber} успешно создан!`)
        router.push('/orders')
      } else {
        const error = await response.json()
        alert(`Ошибка создания заказа: ${error.error}`)
      }
    } catch (error) {
      console.error('Ошибка создания заказа:', error)
      alert('Произошла ошибка при создании заказа')
    } finally {
      setIsLoading(false)
    }
  }

  if (!session?.user) {
    return (
      <div onClick={() => router.push('/login')}>
        {children}
      </div>
    )
  }

  if (cart.items.length === 0) {
    return (
      <div className="opacity-50 cursor-not-allowed">
        {children}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-emerald-600">
            <CreditCard className="w-5 h-5" />
            Оформление заказа
          </DialogTitle>
          <DialogDescription>
            Заполните контактные данные для оформления заказа
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Сводка заказа */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="w-4 h-4 text-emerald-600" />
              <span className="font-medium">Ваш заказ</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Товаров: {cart.totalItems}</span>
                <span className="font-medium">₽{cart.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Контактные данные */}
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900">Контактная информация</h3>
            
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email для связи *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Телефон</Label>
              <Input
                id="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                placeholder="+7 (999) 123-45-67"
              />
            </div>
          </div>

          {/* Адрес доставки */}
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress" className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Адрес доставки
            </Label>
            <Textarea
              id="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
              placeholder="Укажите адрес доставки (необязательно)"
              rows={3}
            />
          </div>

          {/* Кнопки */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading || cart.items.length === 0}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : (
                <CreditCard className="w-4 h-4 mr-2" />
              )}
              {isLoading ? 'Оформляем...' : `Заказать за ₽${cart.totalPrice.toLocaleString()}`}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}