'use client';

import Link from 'next/link';
import { ShoppingCart, Search, Menu, X, Phone, Mail, MapPin, MessageCircle, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCart } from '@/contexts/cart-context';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { cart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Каталог', href: '/catalog' },
    { name: 'Мои заказы', href: '/orders' },
    { name: 'О компании', href: '/about' },
  ];

  return (
    <nav className="bg-gradient-to-r from-white via-emerald-50/30 to-sky-50/30 border-b border-emerald-100/50 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-sky-600 rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-sm">Э</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-sky-700 bg-clip-text text-transparent">ЭкоСфера</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-sky-700 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
            
            {/* Contacts Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Контакты
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end">
                <DropdownMenuLabel className="font-semibold text-gray-900">
                  Свяжитесь с нами
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <a href="tel:+79812808585" className="flex items-center space-x-3 py-3">
                    <Phone className="w-4 h-4 text-green-600" />
                    <div>
                      <div className="font-medium">+7 981 280-85-85</div>
                      <div className="text-xs text-gray-600">Позвонить</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <a href="https://wa.me/79812808585?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9C%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82..." target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 py-3">
                    <MessageCircle className="w-4 h-4 text-green-500" />
                    <div>
                      <div className="font-medium">WhatsApp</div>
                      <div className="text-xs text-gray-600">Написать сообщение</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <a href="https://t.me/+79812808585" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 py-3">
                    <MessageCircle className="w-4 h-4 text-sky-500" />
                    <div>
                      <div className="font-medium">Telegram</div>
                      <div className="text-xs text-gray-600">Написать в мессенджер</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <a href="mailto:info@ecosphere.su" className="flex items-center space-x-3 py-3">
                    <Mail className="w-4 h-4 text-sky-600" />
                    <div>
                      <div className="font-medium">info@ecosphere.su</div>
                      <div className="text-xs text-gray-600">Отправить email</div>
                    </div>
                  </a>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <a href="https://yandex.ru/maps/2/saint-petersburg/house/umanskiy_pereulok_73k3/Z0kYcgJhSkUAQFtjfXV3dH5jZQ==/?ll=30.451364%2C59.965098&z=18.96" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 py-3">
                    <MapPin className="w-4 h-4 text-red-600" />
                    <div>
                      <div className="font-medium">Санкт-Петербург</div>
                      <div className="text-xs text-gray-600">Уманский переулок 73 к3</div>
                    </div>
                  </a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Button */}
            <Button variant="ghost" size="sm" className="hidden sm:flex hover:scale-110 transition-transform duration-200">
              <Search className="w-4 h-4" />
            </Button>

            {/* History/Orders */}
            <Link href="/orders">
              <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform duration-200">
                <History className="w-4 h-4" />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform duration-200">
                <ShoppingCart className="w-4 h-4" />
                {cart.totalItems > 0 && (
                  <Badge 
                    className="absolute -top-2 -right-2 min-w-[20px] h-5 flex items-center justify-center px-1 text-xs font-bold bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0 shadow-lg animate-pulse"
                  >
                    {cart.totalItems > 99 ? '99+' : cart.totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
        )}>
          <div className="pt-4 space-y-2 animate-in slide-in-from-top-2 duration-300">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-base font-medium text-gray-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile Contacts Section */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-3 py-2 text-sm font-semibold text-gray-900 mb-2">
                Контакты
              </div>
              
              <a 
                href="tel:+79812808585" 
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4 text-green-600" />
                <span className="text-base font-medium">+7 981 280-85-85</span>
              </a>
              
              <a 
                href="https://wa.me/79812808585?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5%21%20%D0%9C%D0%B5%D0%BD%D1%8F%20%D0%B8%D0%BD%D1%82%D0%B5%D1%80%D0%B5%D1%81%D1%83%D0%B5%D1%82..." 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                <span className="text-base font-medium">WhatsApp</span>
              </a>
              
              <a 
                href="https://t.me/+79812808585" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <MessageCircle className="w-4 h-4 text-sky-500" />
                <span className="text-base font-medium">Telegram</span>
              </a>
              
              <a 
                href="mailto:info@ecosphere.su" 
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Mail className="w-4 h-4 text-sky-600" />
                <span className="text-base font-medium">info@ecosphere.su</span>
              </a>
              
              <a 
                href="https://yandex.ru/maps/2/saint-petersburg/house/umanskiy_pereulok_73k3/Z0kYcgJhSkUAQFtjfXV3dH5jZQ==/?ll=30.451364%2C59.965098&z=18.96" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <MapPin className="w-4 h-4 text-red-600" />
                <div>
                  <div className="text-base font-medium">Санкт-Петербург</div>
                  <div className="text-xs text-gray-600">Уманский переулок 73 к3</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}