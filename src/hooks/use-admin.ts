'use client'

import { useSession } from 'next-auth/react'

export function useAdmin() {
  const { data: session, status } = useSession()
  
  const userRole = session?.user?.role as string
  const loading = status === 'loading'

  return {
    adminUser: session?.user ? { role: userRole } : null,
    loading,
    isAdmin: userRole === 'ADMIN',
    isManager: userRole === 'MANAGER', 
    hasAdminAccess: userRole === 'ADMIN' || userRole === 'MANAGER'
  }
}