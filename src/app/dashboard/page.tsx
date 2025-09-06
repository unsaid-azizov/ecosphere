'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useFavorites } from '@/contexts/favorites-context';
import { useCart } from '@/contexts/cart-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { User, Building2, Store, Package, Heart, ShoppingCart, History } from 'lucide-react';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      loadOrdersCount();
    }
  }, [status, router]);

  const loadOrdersCount = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const orders = await response.json();
        setOrdersCount(orders.length);
      }
    } catch (error) {
      console.error('Ошибка загрузки количества заказов:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const getUserTypeInfo = () => {
    switch (session.user.userType) {
      case 'INDIVIDUAL':
        return {
          title: 'Физическое лицо',
          icon: User,
          description: 'Персональные покупки',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'IP':
        return {
          title: 'Индивидуальный предприниматель',
          icon: Store,
          description: 'Бизнес-аккаунт ИП',
          color: 'bg-green-100 text-green-800'
        };
      case 'OOO':
        return {
          title: 'ООО / Юридическое лицо',
          icon: Building2,
          description: 'Корпоративный аккаунт',
          color: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          title: 'Пользователь',
          icon: User,
          description: '',
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const userTypeInfo = getUserTypeInfo();
  const Icon = userTypeInfo.icon;

  const getDisplayName = () => {
    if (session.user.firstName && session.user.lastName) {
      return `${session.user.firstName} ${session.user.lastName}`;
    }
    if (session.user.companyName) {
      return session.user.companyName;
    }
    return session.user.email;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Личный кабинет
          </h1>
          <p className="text-gray-600">
            Добро пожаловать в ваш персональный кабинет ЭкоСфера
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Icon className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{getDisplayName()}</CardTitle>
                    <CardDescription className="mt-1">
                      <Badge className={userTypeInfo.color}>
                        {userTypeInfo.title}
                      </Badge>
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{session.user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Тип аккаунта</p>
                    <p className="font-medium">{userTypeInfo.description}</p>
                  </div>
                  <div className="pt-4 border-t">
                    <Button variant="outline" className="w-full">
                      Редактировать профиль
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{ordersCount}</p>
                      <p className="text-sm text-gray-600">Всего заказов</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-pink-100 rounded-lg">
                      <Heart className="w-6 h-6 text-pink-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{favorites.length}</p>
                      <p className="text-sm text-gray-600">Избранное</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-lg">
                      <ShoppingCart className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{cart.totalItems}</p>
                      <p className="text-sm text-gray-600">В корзине</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Быстрые действия</CardTitle>
                <CardDescription>
                  Основные функции вашего аккаунта
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-left justify-start"
                    onClick={() => router.push('/catalog')}
                  >
                    <Package className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Каталог товаров</p>
                      <p className="text-xs text-gray-600">Просмотреть весь ассортимент</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-left justify-start"
                    onClick={() => router.push('/orders')}
                  >
                    <History className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Мои заказы</p>
                      <p className="text-xs text-gray-600">История покупок</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-left justify-start"
                    onClick={() => router.push('/favorites')}
                  >
                    <Heart className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Избранное</p>
                      <p className="text-xs text-gray-600">Сохраненные товары</p>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-16 flex items-center gap-3 text-left justify-start"
                    onClick={() => router.push('/cart')}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Корзина</p>
                      <p className="text-xs text-gray-600">Товары к заказу</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Последняя активность</CardTitle>
                <CardDescription>
                  Ваши недавние действия в системе
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-gray-500">
                  <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>Пока нет активности</p>
                  <p className="text-sm">Начните с просмотра каталога товаров</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}