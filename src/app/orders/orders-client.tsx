'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// Убрали импорт Navbar - он уже есть в родительском компоненте
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, Calendar, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

interface OrderItem {
  id: string
  productId: string
  quantity: number
  price: number
  productName: string
  productCategory: string
  productArticle: string
}

interface Order {
  id: string
  orderNumber: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  totalAmount: number
  createdAt: string
  contactEmail: string
  contactPhone?: string
  deliveryAddress?: string
  orderItems: OrderItem[]
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

export function OrdersClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      loadOrders();
    }
  }, [status, router]);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const ordersData = await response.json();
        setOrders(ordersData);
      } else {
        console.error('Ошибка загрузки заказов');
      }
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Package className="w-8 h-8 text-forest-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              Мои заказы
            </h1>
          </div>
          {orders.length > 0 && (
            <p className="text-gray-600">
              У вас {orders.length} заказ{orders.length > 4 ? 'ов' : orders.length === 1 ? '' : 'а'}
            </p>
          )}
        </div>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <Card key={order.id} className="border-0 shadow-lg animate-in fade-in-0 slide-in-from-bottom-4 duration-300" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-lime-100 rounded-lg">
                        <Package className="w-5 h-5 text-forest-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Заказ {order.orderNumber}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${statusColors[order.status]} mb-2`}>
                        {statusLabels[order.status]}
                      </Badge>
                      <div className="text-lg font-bold text-forest-600">
                        ₽{order.totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Товары в заказе */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Товары ({order.orderItems.length})</h4>
                    <div className="space-y-2">
                      {order.orderItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.productName}</p>
                            <p className="text-sm text-gray-600">Артикул: {item.productArticle}</p>
                          </div>
                          <div className="flex items-center gap-4 text-right">
                            <span className="text-sm text-gray-600">{item.quantity} шт</span>
                            <span className="font-medium">₽{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Контактная информация */}
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Контактная информация</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{order.contactEmail}</span>
                      </div>
                      {order.contactPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{order.contactPhone}</span>
                        </div>
                      )}
                      {order.deliveryAddress && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span>{order.deliveryAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              Пока нет заказов
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-md">
              Когда вы сделаете первый заказ, он появится здесь. 
              Начните с просмотра нашего каталога товаров.
            </p>
            
            <Link href="/catalog">
              <Button className="bg-lime-400 hover:bg-lime-500 text-forest-800">
                <ShoppingBag className="w-5 h-5 mr-2" />
                Перейти в каталог
              </Button>
            </Link>
          </div>
        )}
    </div>
  );
}