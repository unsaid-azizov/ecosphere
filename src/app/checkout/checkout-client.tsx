'use client';

import { useState } from 'react';
import { useCart } from '@/contexts/cart-context';
import { useOrders } from '@/contexts/orders-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, ShoppingBag, Send } from 'lucide-react';
import Link from 'next/link';
import { OrderCustomer } from '@/types/order';
import { cn } from '@/lib/utils';

export function CheckoutClient() {
  const { cart, clearCart } = useCart();
  const { saveOrder, sendOrder } = useOrders();
  const [customer, setCustomer] = useState<OrderCustomer>({
    companyType: 'individual',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    comment: ''
  });

  const handleInputChange = (field: keyof OrderCustomer, value: string) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
  };


  const formatOrderEmail = () => {
    const orderId = Date.now();
    let emailBody = `🛒 ЗАКАЗ №${orderId}%0D%0A%0D%0A`;
    
    // Customer info
    emailBody += `👤 ЗАКАЗЧИК:%0D%0A`;
    emailBody += `Тип: ${getCompanyTypeLabel(customer.companyType)}%0D%0A`;
    if (customer.companyName) {
      emailBody += `Компания: ${encodeURIComponent(customer.companyName)}%0D%0A`;
    }
    if (customer.inn) {
      emailBody += `ИНН: ${customer.inn}%0D%0A`;
    }
    emailBody += `Контактное лицо: ${encodeURIComponent(customer.contactPerson)}%0D%0A`;
    emailBody += `Телефон: ${customer.phone}%0D%0A`;
    emailBody += `Email: ${customer.email}%0D%0A`;
    if (customer.address) {
      emailBody += `Адрес: ${encodeURIComponent(customer.address)}%0D%0A`;
    }
    
    // Order items
    emailBody += `%0D%0A📦 ТОВАРЫ (${cart.totalItems} шт.):%0D%0A`;
    cart.items.forEach((item, index) => {
      const productUrl = `${window.location.origin}/product/${item.product.id}`;
      emailBody += `${index + 1}. ${encodeURIComponent(item.product.name)}%0D%0A`;
      emailBody += `   Артикул: ${item.product.article}%0D%0A`;
      emailBody += `   Ссылка: ${productUrl}%0D%0A`;
      emailBody += `   Цена: ₽${item.product.price.toLocaleString()} × ${item.quantity} шт. = ₽${(item.product.price * item.quantity).toLocaleString()}%0D%0A%0D%0A`;
    });
    
    emailBody += `💰 ИТОГО: ₽${cart.totalPrice.toLocaleString()}%0D%0A`;
    
    if (customer.comment) {
      emailBody += `%0D%0A💬 КОММЕНТАРИЙ:%0D%0A${encodeURIComponent(customer.comment)}%0D%0A`;
    }
    
    emailBody += `%0D%0A📅 Дата заказа: ${new Date().toLocaleString('ru-RU')}%0D%0A`;
    
    return emailBody;
  };

  const getCompanyTypeLabel = (type: string): string => {
    switch (type) {
      case 'individual': return 'Физическое лицо';
      case 'ip': return 'Индивидуальный предприниматель';
      case 'ooo': return 'Общество с ограниченной ответственностью';
      default: return 'Не указано';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!customer.contactPerson || !customer.phone || !customer.email) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if ((customer.companyType === 'ip' || customer.companyType === 'ooo') && 
        (!customer.companyName || !customer.inn)) {
      alert('Пожалуйста, заполните реквизиты компании');
      return;
    }

    // Format email and create mailto link
    const emailBody = formatOrderEmail();
    const subject = encodeURIComponent(`🛒 Новый заказ от ${customer.contactPerson}`);
    const emailUrl = `mailto:info@ecosphere.su?subject=${subject}&body=${emailBody}`;
    
    // Open email client
    window.location.href = emailUrl;
    
    // Show success message
    setTimeout(() => {
      const action = confirm(
        'Почтовый клиент должен открыться с готовым письмом.\n\n' +
        'Отправили письмо? Нажмите "ОК" чтобы очистить корзину и завершить заказ.\n' +
        'Нажмите "Отмена" если хотите попробовать еще раз.'
      );
      
      if (action) {
        // Save to history first
        try {
          const orderData = {
            customer,
            items: cart.items.map(item => ({
              id: item.id,
              name: item.product.name,
              article: item.product.article,
              price: item.product.price,
              quantity: item.quantity,
              total: item.product.price * item.quantity,
              productUrl: `${window.location.origin}/product/${item.product.id}`
            })),
            totalAmount: cart.totalPrice,
            totalItems: cart.totalItems
          };
          
          console.log('Attempting to save order:', orderData);
          const orderId = saveOrder(orderData);
          console.log('Order saved to history with ID:', orderId);
          
          // Wait a bit for localStorage to save, then clear cart and redirect
          setTimeout(() => {
            clearCart();
            window.location.href = '/order-success';
          }, 500);
          
        } catch (error) {
          console.error('Failed to save order to history:', error);
          alert('Заказ отправлен, но не удалось сохранить в историю: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
          clearCart();
          window.location.href = '/order-success';
        }
      }
    }, 1000);
  };

  if (cart.totalItems === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <ShoppingBag className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Корзина пуста
          </h2>
          <p className="text-gray-600 mb-8">
            Добавьте товары из каталога для оформления заказа
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              К каталогу товаров
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/cart" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться в корзину
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Оформление заказа</h1>
        <p className="text-gray-600 mt-1">
          {cart.totalItems} {cart.totalItems === 1 ? 'товар' : cart.totalItems < 5 ? 'товара' : 'товаров'} на сумму ₽{cart.totalPrice.toLocaleString()}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Customer Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Company Type */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Тип заказчика</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={customer.companyType} 
                  onValueChange={(value: 'individual' | 'ip' | 'ooo') => handleInputChange('companyType', value)}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="individual" id="individual" />
                    <Label htmlFor="individual" className="cursor-pointer">Физ. лицо</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ip" id="ip" />
                    <Label htmlFor="ip" className="cursor-pointer">ИП</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ooo" id="ooo" />
                    <Label htmlFor="ooo" className="cursor-pointer">ООО</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Company Details */}
            {(customer.companyType === 'ip' || customer.companyType === 'ooo') && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Реквизиты компании</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="companyName">Название компании *</Label>
                    <Input
                      id="companyName"
                      value={customer.companyName || ''}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder={customer.companyType === 'ip' ? 'ИП Иванов Иван Иванович' : 'ООО "Название"'}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="inn">ИНН *</Label>
                    <Input
                      id="inn"
                      value={customer.inn || ''}
                      onChange={(e) => handleInputChange('inn', e.target.value)}
                      placeholder={customer.companyType === 'ip' ? '123456789012' : '1234567890'}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Контактная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contactPerson">Контактное лицо *</Label>
                  <Input
                    id="contactPerson"
                    value={customer.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    placeholder="Иван Иванович"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={customer.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="example@company.ru"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input
                    id="address"
                    value={customer.address || ''}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="г. Санкт-Петербург, ул. Примерная, д. 123"
                  />
                </div>
                <div>
                  <Label htmlFor="comment">Комментарий к заказу</Label>
                  <Textarea
                    id="comment"
                    value={customer.comment || ''}
                    onChange={(e) => handleInputChange('comment', e.target.value)}
                    placeholder="Дополнительные пожелания, время доставки и т.д."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Ваш заказ</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex justify-between items-start text-sm">
                      <div className="flex-1 mr-2">
                        <div className="font-medium line-clamp-2">{item.product.name}</div>
                        <div className="text-gray-600">{item.quantity} × ₽{item.product.price.toLocaleString()}</div>
                      </div>
                      <div className="font-semibold">
                        ₽{(item.product.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Товары ({cart.totalItems})</span>
                    <span>₽{cart.totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Доставка</span>
                    <span className="text-green-600">По договоренности</span>
                  </div>
                </div>

                <hr />
                
                <div className="flex justify-between font-semibold text-lg">
                  <span>К оплате</span>
                  <span>₽{cart.totalPrice.toLocaleString()}</span>
                </div>

                <Button 
                  type="submit"
                  size="lg" 
                  className="w-full bg-gray-900 hover:bg-gray-800"
                  onClick={(e) => {
                    console.log('Button clicked!');
                    // Не предотвращаем default, пусть форма обрабатывается
                  }}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Отправить заказ
                </Button>
                
                <p className="text-xs text-gray-600 text-center">
                  Откроется ваш почтовый клиент с готовым письмом для отправки заказа
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}