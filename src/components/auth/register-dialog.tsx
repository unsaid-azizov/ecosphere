'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Building2, Store } from 'lucide-react';
import { cn } from '@/lib/utils';

type UserType = 'individual' | 'ip' | 'ooo';

interface RegisterFormData {
  userType: UserType;
  email: string;
  password: string;
  confirmPassword: string;
  // Физ. лицо
  firstName?: string;
  lastName?: string;
  phone?: string;
  // ИП
  ipName?: string;
  inn?: string;
  // ООО
  companyName?: string;
  legalAddress?: string;
  kpp?: string;
}

export function RegisterDialog() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    userType: 'individual',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const userTypes = [
    {
      id: 'individual' as UserType,
      title: 'Физическое лицо',
      description: 'Покупки для личных нужд',
      icon: User
    },
    {
      id: 'ip' as UserType,
      title: 'Индивидуальный предприниматель',
      description: 'ИП с льготами и специальными ценами',
      icon: Store
    },
    {
      id: 'ooo' as UserType,
      title: 'ООО / Юридическое лицо',
      description: 'Корпоративные закупки с максимальными скидками',
      icon: Building2
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Успешная регистрация
        setOpen(false);
        // Здесь можно добавить уведомление о успешной регистрации
      } else {
        // Ошибка регистрации
        console.error('Ошибка регистрации:', data.error);
        // Здесь можно показать ошибку пользователю
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof RegisterFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
          Зарегистрироваться
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-emerald-600">
            Создать аккаунт ЭкоСфера
          </DialogTitle>
          <DialogDescription>
            Выберите тип аккаунта и получите персональные условия
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Выбор типа пользователя */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Тип аккаунта</Label>
            <RadioGroup
              value={formData.userType}
              onValueChange={(value) => updateFormData('userType', value)}
              className="grid gap-4"
            >
              {userTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div key={type.id} className="relative">
                    <RadioGroupItem
                      value={type.id}
                      id={type.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={type.id}
                      className={cn(
                        "flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-emerald-50",
                        formData.userType === type.id
                          ? "border-emerald-500 bg-emerald-50 shadow-md"
                          : "border-gray-200 bg-white"
                      )}
                    >
                      <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-lg",
                        formData.userType === type.id
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-600"
                      )}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{type.title}</div>
                        <div className="text-sm text-gray-600 mt-1">{type.description}</div>
                      </div>
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>

          {/* Базовые поля */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="ваш@email.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Пароль *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Минимум 8 символов"
                required
              />
            </div>
          </div>

          {/* Специфические поля для каждого типа */}
          {formData.userType === 'individual' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Личные данные</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Имя *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName || ''}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder="Иван"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Фамилия *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName || ''}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder="Иванов"
                    required
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.userType === 'ip' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Данные ИП</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="ipName">Наименование ИП *</Label>
                  <Input
                    id="ipName"
                    value={formData.ipName || ''}
                    onChange={(e) => updateFormData('ipName', e.target.value)}
                    placeholder="ИП Иванов Иван Иванович"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="inn">ИНН *</Label>
                  <Input
                    id="inn"
                    value={formData.inn || ''}
                    onChange={(e) => updateFormData('inn', e.target.value)}
                    placeholder="123456789012"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон</Label>
                  <Input
                    id="phone"
                    value={formData.phone || ''}
                    onChange={(e) => updateFormData('phone', e.target.value)}
                    placeholder="+7 (999) 123-45-67"
                  />
                </div>
              </div>
            </div>
          )}

          {formData.userType === 'ooo' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Данные организации</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Наименование организации *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName || ''}
                    onChange={(e) => updateFormData('companyName', e.target.value)}
                    placeholder='ООО "Эко Решения"'
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="inn">ИНН *</Label>
                    <Input
                      id="inn"
                      value={formData.inn || ''}
                      onChange={(e) => updateFormData('inn', e.target.value)}
                      placeholder="1234567890"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kpp">КПП</Label>
                    <Input
                      id="kpp"
                      value={formData.kpp || ''}
                      onChange={(e) => updateFormData('kpp', e.target.value)}
                      placeholder="123456789"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="legalAddress">Юридический адрес</Label>
                  <Input
                    id="legalAddress"
                    value={formData.legalAddress || ''}
                    onChange={(e) => updateFormData('legalAddress', e.target.value)}
                    placeholder="г. Москва, ул. Примерная, д. 1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Кнопки */}
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
              className="flex-1 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              ) : null}
              Создать аккаунт
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}