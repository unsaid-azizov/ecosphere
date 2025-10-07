import { Navbar } from '@/components/navbar';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Leaf, Globe, Truck, Shield, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-lime-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-800/5 to-lime-400/5"></div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-black text-forest-900 leading-tight">
                Экологичные товары для вашего
                <span className="text-lime-600"> бизнеса</span>
              </h1>
              <p className="text-xl text-forest-700 leading-relaxed">
                Широкий ассортимент товаров для гостиниц и отелей. Качество, надежность и забота об окружающей среде.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/catalog">
                  <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-white text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-200">
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Открыть каталог
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-2 border-forest-600 text-forest-600 hover:bg-forest-50 text-lg px-8 py-6">
                    О компании
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-lime-400 to-forest-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-3xl bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/icon.webp"
                    alt="ЭкоСфера"
                    width={400}
                    height={400}
                    className="w-3/4 h-3/4 object-contain"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-forest-900 mb-4">Почему выбирают нас</h2>
            <p className="text-xl text-forest-600">Преимущества работы с ЭкоСфера</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Leaf,
                title: 'Экологичность',
                description: 'Все товары соответствуют экологическим стандартам'
              },
              {
                icon: Shield,
                title: 'Качество',
                description: 'Только проверенные производители и сертифицированная продукция'
              },
              {
                icon: Truck,
                title: 'Быстрая доставка',
                description: 'Доставка по всей России в кратчайшие сроки'
              },
              {
                icon: Star,
                title: 'Выгодные цены',
                description: 'Конкурентные цены и специальные предложения для партнеров'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-sage-50 to-lime-50 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-14 h-14 bg-lime-400 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-forest-900 mb-3">{feature.title}</h3>
                <p className="text-forest-700 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-forest-800 to-forest-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Готовы начать работу с нами?
          </h2>
          <p className="text-xl text-lime-100 mb-8">
            Откройте каталог и выберите товары для вашего бизнеса уже сегодня
          </p>
          <Link href="/catalog">
            <Button size="lg" className="bg-lime-500 hover:bg-lime-600 text-white text-lg px-12 py-6 shadow-2xl hover:shadow-3xl transition-all duration-200 hover:scale-105">
              <ShoppingCart className="w-6 h-6 mr-3" />
              Перейти в каталог
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-900 text-lime-100 py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">ЭкоСфера</h3>
              <p className="text-lime-200 leading-relaxed">
                Поставщик экологичных товаров для гостиничного бизнеса
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Навигация</h3>
              <ul className="space-y-2">
                <li><Link href="/catalog" className="hover:text-lime-300 transition-colors">Каталог</Link></li>
                <li><Link href="/about" className="hover:text-lime-300 transition-colors">О компании</Link></li>
                <li><Link href="/blog" className="hover:text-lime-300 transition-colors">Блог</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Контакты</h3>
              <ul className="space-y-2 text-lime-200">
                <li>+7 981 280-85-85</li>
                <li>info@ecosphere.su</li>
                <li>СПб, улица Коллонтай 28к1</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-forest-700 mt-8 pt-8 text-center text-lime-200">
            <p>&copy; 2024 ЭкоСфера. Все права защищены.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
