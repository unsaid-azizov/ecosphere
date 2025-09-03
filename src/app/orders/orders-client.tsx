'use client';

import { useOrders } from '@/contexts/orders-context';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Trash2, ShoppingBag, RefreshCw, Calendar, User, Package } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types/order';

export function OrdersClient() {
  const { orders, sendOrder, deleteOrder, clearHistory } = useOrders();
  const { clearCart } = useCart();
  
  console.log('OrdersClient rendered with orders:', orders);
  console.log('Orders length:', orders.length);

  const handleResendOrder = (orderId: string) => {
    const success = sendOrder(orderId);
    if (success) {
      alert('Почтовый клиент открыт с письмом для повторной отправки!');
    } else {
      alert('Не удалось открыть почтовый клиент. Проверьте настройки браузера.');
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот заказ из истории?')) {
      deleteOrder(orderId);
    }
  };

  const getStatusBadge = (order: Order) => {
    switch (order.status) {
      case 'draft':
        return <Badge variant="outline" className="text-gray-600">Черновик</Badge>;
      case 'sent':
        return <Badge variant="default" className="bg-blue-600">Отправлен</Badge>;
      case 'confirmed':
        return <Badge variant="default" className="bg-green-600">Подтвержден</Badge>;
      case 'processing':
        return <Badge variant="default" className="bg-yellow-600">В обработке</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-700">Выполнен</Badge>;
      default:
        return <Badge variant="outline">Неизвестно</Badge>;
    }
  };

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            История заказов пуста
          </h2>
          <p className="text-gray-600 mb-8">
            Здесь будут отображаться все ваши заказы после их создания
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              <Package className="w-4 h-4 mr-2" />
              Перейти к каталогу
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <Link href="/catalog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          К каталогу
        </Link>
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Мои заказы</h1>
            <p className="text-gray-600 mt-1">
              История всех ваших заказов ({orders.length})
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => clearCart()}
              className="text-red-600 hover:text-red-700 text-sm"
              size="sm"
            >
              Очистить корзину
            </Button>
            {orders.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  if (confirm('Вы уверены, что хотите удалить всю историю заказов?')) {
                    clearHistory();
                  }
                }}
                className="text-red-600 hover:text-red-700 text-sm"
                size="sm"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Очистить историю
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <Card key={order.id} className="overflow-hidden">
            <CardHeader className="bg-gray-50">
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
                <div className="flex-1">
                  <CardTitle className="text-base sm:text-lg">Заказ #{order.id}</CardTitle>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{order.createdAt.toLocaleDateString('ru-RU')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span className="truncate max-w-[120px] sm:max-w-none">{order.customer.contactPerson}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Package className="w-4 h-4" />
                      <span>{order.totalItems} {order.totalItems === 1 ? 'товар' : order.totalItems < 5 ? 'товара' : 'товаров'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  {getStatusBadge(order)}
                  {order.sentCount > 0 && (
                    <Badge variant="outline" className="text-blue-600 text-xs">
                      Отправлен {order.sentCount} раз
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {/* Customer Info */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Заказчик:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div><strong>Тип:</strong> {order.customer.companyType === 'individual' ? 'Физ. лицо' : order.customer.companyType === 'ip' ? 'ИП' : 'ООО'}</div>
                  {order.customer.companyName && <div><strong>Компания:</strong> {order.customer.companyName}</div>}
                  {order.customer.inn && <div><strong>ИНН:</strong> {order.customer.inn}</div>}
                  <div><strong>Контакт:</strong> {order.customer.contactPerson}</div>
                  <div><strong>Телефон:</strong> {order.customer.phone}</div>
                  <div><strong>Email:</strong> {order.customer.email}</div>
                  {order.customer.address && <div><strong>Адрес:</strong> {order.customer.address}</div>}
                </div>
              </div>

              {/* Items */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Товары:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        <div className="text-gray-600">Артикул: {item.article}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₽{item.total.toLocaleString()}</div>
                        <div className="text-gray-600">{item.quantity} × ₽{item.price.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total and Actions */}
              <div className="flex flex-col space-y-3 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 pt-4 border-t">
                <div className="text-lg font-semibold">
                  Итого: ₽{order.totalAmount.toLocaleString()}
                </div>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleResendOrder(order.id)}
                    className="text-blue-600 hover:text-blue-700 w-full sm:w-auto"
                  >
                    <Send className="w-4 h-4 mr-1" />
                    <span className="sm:hidden">
                      {order.sentCount > 0 ? 'Повторно' : 'Отправить'}
                    </span>
                    <span className="hidden sm:inline">
                      {order.sentCount > 0 ? 'Отправить повторно' : 'Отправить'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteOrder(order.id)}
                    className="text-red-600 hover:text-red-700 w-full sm:w-auto"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              </div>
              
              {order.lastSentAt && (
                <div className="text-xs text-gray-500 mt-2">
                  Последняя отправка: {order.lastSentAt.toLocaleString('ru-RU')}
                </div>
              )}
              
              {order.customer.comment && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Комментарий:</div>
                  <div className="text-sm text-blue-800 mt-1">{order.customer.comment}</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}