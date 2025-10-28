'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingCart } from 'lucide-react';
import { getGuestFavorites, removeFromGuestFavorites } from '@/lib/guest-cart';
import { addToGuestCart } from '@/lib/guest-cart';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  article: string;
  images: string[];
  isAvailable: boolean;
  categories: string[];
}

export default function GuestFavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const guestFavorites = getGuestFavorites();
    setFavorites(guestFavorites);

    if (guestFavorites.length > 0) {
      await fetchProducts(guestFavorites);
    }
    setLoading(false);
  };

  const fetchProducts = async (productIds: string[]) => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const allProducts = await response.json();
        const favoriteProducts = allProducts.filter((p: Product) =>
          productIds.includes(p.id)
        );
        setProducts(favoriteProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  const handleRemove = (productId: string) => {
    removeFromGuestFavorites(productId);
    setFavorites(getGuestFavorites());
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Удалено из избранного');
  };

  const handleAddToCart = (productId: string) => {
    addToGuestCart(productId, 1);
    toast.success('Добавлено в корзину');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Загрузка...</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Избранное пусто</CardTitle>
            <CardDescription>
              Добавьте товары в избранное из каталога
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <Heart className="h-8 w-8 text-red-500 fill-red-500" />
          Избранное
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                {product.images[0] && (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                )}
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Артикул: {product.article}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {product.categories.map((cat, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
                <p className="text-2xl font-bold mb-4">
                  ₽{product.price.toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAddToCart(product.id)}
                    disabled={!product.isAvailable}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    В корзину
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleRemove(product.id)}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
