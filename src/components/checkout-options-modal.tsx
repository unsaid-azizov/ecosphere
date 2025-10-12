'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { UserPlus, ShoppingCart } from 'lucide-react';

interface CheckoutOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CheckoutOptionsModal({ open, onOpenChange }: CheckoutOptionsModalProps) {
  const router = useRouter();

  const handleRegister = () => {
    onOpenChange(false);
    router.push('/auth/register');
  };

  const handleGuestCheckout = () => {
    onOpenChange(false);
    router.push('/checkout/guest');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Оформление заказа
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            Выберите способ оформления заказа
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-6">
          {/* Register Option */}
          <div className="border-2 border-lime-400 rounded-lg p-6 bg-lime-50/50">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lime-400 rounded-full flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-forest-800" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  Зарегистрироваться (Рекомендуется)
                </h3>
                <ul className="text-sm text-gray-600 space-y-1 mb-4">
                  <li>✓ Отслеживание всех заказов</li>
                  <li>✓ Сохранение избранного</li>
                  <li>✓ Персональные скидки</li>
                  <li>✓ Быстрое оформление следующих заказов</li>
                </ul>
                <Button
                  className="w-full bg-lime-400 hover:bg-lime-500 text-forest-800"
                  onClick={handleRegister}
                >
                  Создать аккаунт
                </Button>
              </div>
            </div>
          </div>

          {/* Guest Checkout Option */}
          <div className="border-2 border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">
                  Продолжить как гость
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Оформите заказ, указав только email и телефон.
                  Вы сможете отследить заказ по номеру.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGuestCheckout}
                >
                  Оформить как гость
                </Button>
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-center text-gray-500">
          У вас уже есть аккаунт?{' '}
          <button
            onClick={() => {
              onOpenChange(false);
              router.push('/auth/signin');
            }}
            className="text-lime-600 hover:text-lime-700 font-medium"
          >
            Войти
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
