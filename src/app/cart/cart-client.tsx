'use client';

import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { CartItem } from '@/components/cart-item';
import { CheckoutDialog } from '@/components/checkout-dialog';

export function CartClient() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

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
            Добавьте товары из каталога, чтобы оформить заказ
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-lime-400 hover:bg-lime-500 text-forest-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Перейти к покупкам
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Link href="/catalog" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Вернуться к покупкам
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Корзина</h1>
        <p className="text-gray-600 mt-1">
          {cart.totalItems} {cart.totalItems === 1 ? 'товар' : cart.totalItems < 5 ? 'товара' : 'товаров'} на сумму ₽{cart.totalPrice.toLocaleString()}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <CartItem 
              key={item.id} 
              item={item} 
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}

          {/* Clear Cart Button */}
          <div className="pt-4">
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Очистить корзину
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Итого к заказу</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Товары ({cart.totalItems})
                </span>
                <span>₽{cart.totalPrice.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Доставка</span>
                <span className="text-green-600">Бесплатно</span>
              </div>

              <hr />
              
              <div className="flex justify-between font-semibold text-lg">
                <span>К оплате</span>
                <span>₽{cart.totalPrice.toLocaleString()}</span>
              </div>

              <CheckoutDialog>
                <Button size="lg" className="w-full bg-lime-400 hover:bg-lime-500 text-forest-800">
                  Оформить заказ
                </Button>
              </CheckoutDialog>
              
              <div className="pt-2">
                <Link href="/catalog">
                  <Button variant="outline" size="lg" className="w-full">
                    Продолжить покупки
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}