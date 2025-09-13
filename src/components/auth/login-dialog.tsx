'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { LogIn, Phone, Mail, MessageCircle } from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
}

export function LoginDialog() {
  const [open, setOpen] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        // Успешный вход
        setOpen(false);
        // Здесь можно добавить redirect или обновление страницы
        window.location.reload();
      } else {
        // Ошибка входа
        console.error('Ошибка входа:', result?.error);
        // Здесь можно показать ошибку пользователю
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-lime-400 hover:bg-lime-500 text-forest-800">
          <LogIn className="w-4 h-4 mr-2" />
          Войти
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-forest-800">
            Вход в аккаунт
          </DialogTitle>
          <DialogDescription>
            Введите ваши данные для входа в систему
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email</Label>
            <Input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              placeholder="ваш@email.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Пароль</Label>
            <Input
              id="login-password"
              type="password"
              value={formData.password}
              onChange={(e) => updateFormData('password', e.target.value)}
              placeholder="Введите пароль"
              required
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <Button
              type="button"
              variant="ghost"
              className="text-forest-600 hover:text-forest-700 p-0 h-auto"
              onClick={() => setShowSupportDialog(true)}
            >
              Забыли пароль?
            </Button>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 bg-lime-400 hover:bg-lime-500 text-forest-800"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : null}
              Войти
            </Button>
          </div>
        </form>
      </DialogContent>
      
      {/* Support Contact Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-forest-800">
              Забыли пароль?
            </DialogTitle>
            <DialogDescription>
              Свяжитесь с нашей службой поддержки для восстановления доступа к аккаунту
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-emerald-900">Телефон</p>
                  <p className="text-sm text-emerald-700">+7 981 280-85-85</p>
                  <p className="text-xs text-emerald-600">Ежедневно с 9:00 до 21:00</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">WhatsApp</p>
                  <p className="text-sm text-green-700">+7 981 280-85-85</p>
                  <p className="text-xs text-green-600">Быстрые ответы в мессенджере</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                <MessageCircle className="w-5 h-5 text-sky-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sky-900">Telegram</p>
                  <p className="text-sm text-sky-700">+7 981 280-85-85</p>
                  <p className="text-xs text-sky-600">Онлайн поддержка</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-blue-900">Email</p>
                  <p className="text-sm text-blue-700">info@ecosphere.su</p>
                  <p className="text-xs text-blue-600">Ответим в течение 24 часов</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <Button
                onClick={() => setShowSupportDialog(false)}
                className="bg-lime-400 hover:bg-lime-500 text-forest-800"
              >
                Понятно
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}