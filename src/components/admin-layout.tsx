'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin-sidebar'
import { UserRole } from '@prisma/client'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
  userRole: UserRole
}

export function AdminLayout({ children, userRole }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>

      {/* Mobile animated sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminSidebar userRole={userRole} onClose={() => setSidebarOpen(false)} />
      </div>
      
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <AdminSidebar userRole={userRole} />
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden hover:bg-gray-100 transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">ЭкоСфера Админ</h1>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}