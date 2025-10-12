'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { getGuestCart, clearGuestCart, GuestCartItem } from '@/lib/guest-cart';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  article: string;
  images: string[];
}

export default function GuestCheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<GuestCartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    deliveryAddress: '',
  });

  useEffect(() => {
    // Load guest cart
    const guestCart = getGuestCart();
    setCart(guestCart);

    // Fetch products
    if (guestCart.length > 0) {
      fetchProducts(guestCart.map(item => item.productId));
    }
  }, []);

  const fetchProducts = async (productIds: string[]) => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const allProducts = await response.json();
        const cartProducts = allProducts.filter((p: Product) =>
          productIds.includes(p.id)
        );
        setProducts(cartProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const totalAmount = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/orders/guest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при оформлении заказа');
      }

      // Clear cart
      clearGuestCart();

      // Show success message
      toast.success('Заказ успешно оформлен!', {
        description: `Номер заказа: ${data.order.orderNumber}`,
      });

      // Redirect to order tracking page
      router.push(`/orders/track?email=${encodeURIComponent(formData.email)}&order=${data.order.orderNumber}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Ошибка при оформлении заказа');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Корзина пуста</CardTitle>
            <CardDescription>
              Добавьте товары в корзину, чтобы оформить заказ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/catalog')}>
              Перейти в каталог
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Оформление заказа</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Form */}
          <Card>
            <CardHeader>
              <CardTitle>Контактная информация</CardTitle>
              <CardDescription>
                Укажите ваши данные для оформления заказа
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>

                <div>
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="Иван"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Фамилия</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Иванов"
                  />
                </div>

                <div>
                  <Label htmlFor="deliveryAddress">Адрес доставки</Label>
                  <Textarea
                    id="deliveryAddress"
                    value={formData.deliveryAddress}
                    onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                    placeholder="г. Москва, ул. Примерная, д. 1, кв. 10"
                    rows={3}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Оформление...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Оформить заказ
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Ваш заказ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cart.map((item) => {
                  const product = products.find(p => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div key={item.productId} className="flex justify-between items-center">
                      <div className="flex-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} × ₽{product.price.toLocaleString()}
                        </p>
                      </div>
                      <p className="font-medium">
                        ₽{(product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  );
                })}

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Итого:</span>
                    <span>₽{totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-sm">
                  <p className="font-medium mb-2">После оформления заказа:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Вы получите номер заказа</li>
                    <li>Менеджер свяжется с вами для подтверждения</li>
                    <li>Вы сможете отследить статус заказа</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
