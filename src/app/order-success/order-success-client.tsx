'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Phone, MessageCircle, Mail } from 'lucide-react';
import Link from 'next/link';

export function OrderSuccessClient() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Заказ успешно отправлен!
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          Спасибо за ваш заказ. Наш менеджер свяжется с вами в ближайшее время для подтверждения деталей.
        </p>

        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Что будет дальше?</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">1</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Обработка заказа</div>
                  <div>Менеджер обработает ваш заказ в течение 1-2 часов в рабочее время</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">2</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Подтверждение</div>
                  <div>Мы свяжемся с вами для уточнения деталей заказа и доставки</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-blue-600">3</span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">Доставка</div>
                  <div>Согласуем удобное для вас время и способ доставки товаров</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Нужна помощь? Свяжитесь с нами</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a 
                href="tel:+79812808585" 
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Phone className="w-4 h-4 text-green-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Позвонить</div>
                  <div className="text-gray-600">+7 981 280-85-85</div>
                </div>
              </a>
              
              <a 
                href="https://wa.me/79812808585?text=Здравствуйте! Отправил заказ на сайте" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">WhatsApp</div>
                  <div className="text-gray-600">Быстрый ответ</div>
                </div>
              </a>
              
              <a 
                href="mailto:info@ecosphere.su?subject=Вопрос по заказу" 
                className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">Email</div>
                  <div className="text-gray-600">info@ecosphere.su</div>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Link href="/catalog">
            <Button size="lg" className="bg-gray-900 hover:bg-gray-800">
              Продолжить покупки
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}