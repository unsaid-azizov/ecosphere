'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Users, 
  Package, 
  Settings,
  Tag,
  LogOut,
  X,
  BookOpen
} from 'lucide-react'
import { UserRole } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'

interface AdminSidebarProps {
  userRole: UserRole
  onClose?: () => void
}

const navigation = [
  {
    name: 'Главная',
    href: '/admin',
    icon: LayoutDashboard,
    roles: ['ADMIN', 'MANAGER']
  },
  {
    name: 'Заказы',
    href: '/admin/orders',
    icon: ShoppingCart,
    roles: ['ADMIN', 'MANAGER']
  },
  {
    name: 'Пользователи',
    href: '/admin/users',
    icon: Users,
    roles: ['ADMIN']
  },
  {
    name: 'Товары',
    href: '/admin/products',
    icon: Package,
    roles: ['ADMIN']
  },
  {
    name: 'Скидки',
    href: '/admin/discounts',
    icon: Tag,
    roles: ['ADMIN']
  },
  {
    name: 'Блог',
    href: '/admin/blog',
    icon: BookOpen,
    roles: ['ADMIN']
  },
  {
    name: 'Настройки',
    href: '/admin/settings',
    icon: Settings,
    roles: ['ADMIN']
  }
]

export function AdminSidebar({ userRole, onClose }: AdminSidebarProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(userRole)
  )

  if (!mounted) {
    return (
      <div className="flex h-full w-64 flex-col bg-gradient-to-b from-emerald-50 to-teal-100 shadow-2xl border-r border-emerald-200">
        <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-emerald-200/50">
          <h1 className="text-xl font-bold text-emerald-800 animate-in slide-in-from-left-2 duration-300">ЭкоСфера Админ</h1>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="lg:hidden p-2 hover:bg-emerald-200/50 transition-all duration-200 hover:scale-105"
            >
              <X className="h-5 w-5 text-emerald-700" />
            </Button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-emerald-600 animate-in fade-in duration-500">Загрузка...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-full w-64 flex-col bg-gradient-to-b from-emerald-50 to-teal-100 shadow-2xl border-r border-emerald-200">
      <div className="flex h-16 shrink-0 items-center justify-between px-4 border-b border-emerald-200/50">
        <h1 className="text-xl font-bold text-emerald-800 animate-in slide-in-from-left-2 duration-300">ЭкоСфера Админ</h1>
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden p-2 hover:bg-emerald-200/50 transition-all duration-200 hover:scale-105"
          >
            <X className="h-5 w-5 text-emerald-700" />
          </Button>
        )}
      </div>
      
      <nav className="flex-1 space-y-1 px-2 py-4">
        {filteredNavigation.map((item, index) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={cn(
                'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 hover:scale-105 animate-in slide-in-from-left-2',
                isActive
                  ? 'bg-emerald-500 text-white shadow-md transform scale-105'
                  : 'text-emerald-800 hover:bg-emerald-200/70 hover:text-emerald-900 hover:shadow-sm'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-white' : 'text-emerald-700 group-hover:text-emerald-900'
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-emerald-200 p-4 animate-in slide-in-from-bottom-2 duration-700">
        <div className="mb-4 animate-in fade-in duration-1000 delay-300">
          <p className="text-xs text-emerald-600 uppercase tracking-wider">Роль</p>
          <p className="text-sm text-emerald-800 font-medium">
            {userRole === 'ADMIN' ? 'Администратор' : 'Менеджер'}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="w-full justify-start text-emerald-700 hover:bg-emerald-200/70 hover:text-emerald-900 transition-all duration-200 hover:scale-105 animate-in slide-in-from-bottom-2 duration-500 delay-500"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Выйти
        </Button>
      </div>
    </div>
  )
}