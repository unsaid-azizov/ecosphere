'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Package, Search } from 'lucide-react';
import { toast } from 'sonner';

interface OrderItem {
  productName: string;
  productArticle: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  contactEmail: string;
  contactPhone: string;
  deliveryAddress?: string;
  createdAt: string;
  orderItems: OrderItem[];
}

const statusNames: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Ожидает обработки', color: 'bg-yellow-500' },
  CONFIRMED: { label: 'Подтвержден', color: 'bg-blue-500' },
  PROCESSING: { label: 'В обработке', color: 'bg-purple-500' },
  SHIPPED: { label: 'Отправлен', color: 'bg-orange-500' },
  DELIVERED: { label: 'Доставлен', color: 'bg-green-500' },
  CANCELLED: { label: 'Отменен', color: 'bg-red-500' },
};

function OrderTrackingContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    orderNumber: searchParams.get('order') || '',
  });

  useEffect(() => {
    // Auto-load order if params provided
    if (formData.email && formData.orderNumber) {
      handleSearch();
    }
  }, []);

  const handleSearch = async () => {
    if (!formData.email || !formData.orderNumber) {
      toast.error('Заполните все поля');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/orders/track?email=${encodeURIComponent(formData.email)}&orderNumber=${encodeURIComponent(formData.orderNumber)}`
      );

      if (!response.ok) {
        throw new Error('Заказ не найден');
      }

      const data = await response.json();
      setOrder(data);
    } catch (error) {
      console.error('Error tracking order:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при поиске заказа');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Отслеживание заказа</h1>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Найти заказ</CardTitle>
            <CardDescription>
              Введите email и номер заказа для отслеживания статуса
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="orderNumber">Номер заказа</Label>
                <Input
                  id="orderNumber"
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  placeholder="ORD-1234567890"
                />
              </div>

              <Button onClick={handleSearch} disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Поиск...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Найти заказ
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        {order && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Заказ #{order.orderNumber}
                  </CardTitle>
                  <CardDescription>
                    Оформлен {new Date(order.createdAt).toLocaleString('ru-RU')}
                  </CardDescription>
                </div>
                <Badge className={statusNames[order.status]?.color || 'bg-gray-500'}>
                  {statusNames[order.status]?.label || order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="font-semibold mb-2">Контактная информация</h3>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-muted-foreground">Email:</span>{' '}
                    {order.contactEmail}
                  </p>
                  <p>
                    <span className="text-muted-foreground">Телефон:</span>{' '}
                    {order.contactPhone}
                  </p>
                  {order.deliveryAddress && (
                    <p>
                      <span className="text-muted-foreground">Адрес доставки:</span>{' '}
                      {order.deliveryAddress}
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Товары</h3>
                <div className="space-y-3">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{item.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Артикул: {item.productArticle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ₽{item.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₽{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Итого:</span>
                  <span>₽{order.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>}>
      <OrderTrackingContent />
    </Suspense>
  );
}
