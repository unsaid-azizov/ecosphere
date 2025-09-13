'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/product-card';
import { useFavorites } from '@/contexts/favorites-context';
import { Product } from '@/types/product';
import { Heart, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FavoritesClient() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { favorites, loading } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Убрали принудительное перенаправление - пусть неавторизованные пользователи 
  // тоже видят страницу избранного (с предложением авторизоваться)

  useEffect(() => {
    async function fetchFavoriteProducts() {
      if (favorites.length === 0) {
        setFavoriteProducts([]);
        return;
      }

      try {
        setProductsLoading(true);
        setError(null);
        
        // Получаем все товары из API
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Не удалось загрузить товары');
        }
        
        const allProducts = await response.json();
        
        // Фильтруем только избранные товары
        const filteredProducts = allProducts.filter((product: Product) => 
          favorites.includes(product.id)
        );
        
        setFavoriteProducts(filteredProducts);
      } catch (err) {
        console.error('Error fetching favorite products:', err);
        setError(err instanceof Error ? err.message : 'Ошибка загрузки товаров');
      } finally {
        setProductsLoading(false);
      }
    }

    fetchFavoriteProducts();
  }, [favorites]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-gray-600">Загрузка избранных товаров...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Требуется авторизация
        </h2>
        <p className="text-gray-600 mb-8">
          Войдите в аккаунт, чтобы увидеть ваши избранные товары
        </p>
        <Link href="/auth/signin">
          <Button className="bg-lime-400 hover:bg-lime-500 text-forest-800">
            Войти в аккаунт
          </Button>
        </Link>
      </div>
    );
  }

  if (productsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-lime-400 text-forest-800 rounded-md hover:bg-lime-500"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-red-500" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {favoriteProducts.length > 0 
                ? `${favoriteProducts.length} товар${favoriteProducts.length > 4 ? 'ов' : favoriteProducts.length === 1 ? '' : 'а'} в избранном`
                : 'Избранные товары'
              }
            </h2>
            <p className="text-gray-600">
              {favoriteProducts.length > 0 
                ? 'Ваши любимые экологические товары'
                : 'Добавляйте товары в избранное, чтобы легко их найти'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {favoriteProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6 w-full justify-items-stretch">
          {favoriteProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Heart className="w-12 h-12 text-gray-400" />
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">
            Пока нет избранных товаров
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md">
            Добавляйте товары в избранное, нажимая на сердечко на карточках товаров. 
            Так вы сможете быстро найти понравившиеся вам товары.
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