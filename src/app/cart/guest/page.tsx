'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { getGuestCart, updateGuestCartItem, removeFromGuestCart, GuestCartItem } from '@/lib/guest-cart';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  article: string;
  images: string[];
  isAvailable: boolean;
}

export default function GuestCartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<GuestCartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    const guestCart = getGuestCart();
    setCart(guestCart);

    if (guestCart.length > 0) {
      await fetchProducts(guestCart.map(item => item.productId));
    }
    setLoading(false);
  };

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

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    updateGuestCartItem(productId, quantity);
    setCart(getGuestCart());
    toast.success('Количество обновлено');
  };

  const handleRemove = (productId: string) => {
    removeFromGuestCart(productId);
    setCart(getGuestCart());
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Товар удален из корзины');
  };

  const totalAmount = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Корзина пуста</CardTitle>
            <CardDescription>
              Добавьте товары в корзину из каталога
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
        <h1 className="text-3xl font-bold mb-8">Корзина</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cart.map((item) => {
              const product = products.find(p => p.id === item.productId);
              if (!product) return null;

              return (
                <Card key={item.productId}>
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {product.images[0] && (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Артикул: {product.article}
                        </p>
                        <p className="text-lg font-bold mt-2">
                          ₽{product.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(item.productId)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-16 text-center"
                            min="1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Summary */}
          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Итого</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Товары ({cart.length})</span>
                    <span>₽{totalAmount.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Итого:</span>
                      <span>₽{totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => router.push('/checkout/guest')}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Оформить заказ
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Оформляя заказ, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
