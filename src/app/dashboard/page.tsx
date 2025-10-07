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
import { ProfileEditDialog } from '@/components/profile-edit-dialog';
import { User, Building2, Store, Package, Heart, ShoppingCart, History } from 'lucide-react';

interface Activity {
  id: string;
  type: 'order' | 'favorite';
  title: string;
  description: string;
  date: Date;
  productId?: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { favorites } = useFavorites();
  const { cart } = useCart();
  const [ordersCount, setOrdersCount] = useState(0);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      loadOrdersCount();
      loadRecentActivities();
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

  const loadRecentActivities = async () => {
    setLoadingActivities(true);
    try {
      // Load orders and favorites
      const [ordersRes, favoritesRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/favorites'),
      ]);

      const activities: Activity[] = [];

      // Add orders to activities
      if (ordersRes.ok) {
        const orders = await ordersRes.json();
        orders.slice(0, 5).forEach((order: any) => {
          activities.push({
            id: `order-${order.id}`,
            type: 'order',
            title: `Заказ #${order.orderNumber}`,
            description: `${order.orderItems?.length || 0} товаров на сумму ${order.totalAmount} ₽`,
            date: new Date(order.createdAt),
          });
        });
      }

      // Add favorites to activities
      if (favoritesRes.ok) {
        const favs = await favoritesRes.json();

        // Load product details for favorites
        const productPromises = favs.slice(0, 5).map(async (fav: any) => {
          try {
            const prodRes = await fetch(`/api/products/${fav.productId}`);
            if (prodRes.ok) {
              const product = await prodRes.json();
              return {
                id: `favorite-${fav.id}`,
                type: 'favorite' as const,
                title: 'Добавлено в избранное',
                description: product.name,
                date: new Date(fav.createdAt),
                productId: fav.productId,
              };
            }
          } catch (err) {
            return null;
          }
          return null;
        });

        const favoriteActivities = (await Promise.all(productPromises)).filter(Boolean) as Activity[];
        activities.push(...favoriteActivities);
      }

      // Sort by date and take last 5
      activities.sort((a, b) => b.date.getTime() - a.date.getTime());
      setRecentActivities(activities.slice(0, 5));
    } catch (error) {
      console.error('Ошибка загрузки активности:', error);
    } finally {
      setLoadingActivities(false);
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
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowEditDialog(true)}
                    >
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
                  Ваши действия в системе
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingActivities ? (
                  <div className="flex justify-center py-8">
                    <div className="w-8 h-8 border-4 border-emerald-600/30 border-t-emerald-600 rounded-full animate-spin" />
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Пока нет активности</p>
                    <p className="text-sm">Начните с просмотра каталога товаров</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => {
                          if (activity.type === 'order') {
                            router.push('/orders');
                          } else if (activity.productId) {
                            router.push(`/product/${activity.productId}`);
                          }
                        }}
                      >
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'order'
                            ? 'bg-blue-100'
                            : 'bg-pink-100'
                        }`}>
                          {activity.type === 'order' ? (
                            <Package className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Heart className="w-4 h-4 text-pink-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-gray-900">
                            {activity.title}
                          </p>
                          <p className="text-sm text-gray-600 truncate">
                            {activity.description}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Intl.DateTimeFormat('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            }).format(activity.date)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <ProfileEditDialog open={showEditDialog} onOpenChange={setShowEditDialog} />
    </div>
  );
}