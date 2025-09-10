import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

export type AdminUser = {
  id: string
  email: string
  role: UserRole
}

export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, role: true }
    })

    if (!user || user.role === 'USER') {
      return null
    }

    return user
  } catch (error) {
    console.error('Error getting admin user:', error)
    return null
  }
}

export async function requireAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser()
  
  if (!adminUser) {
    throw new Error('Access denied: Admin privileges required')
  }
  
  if (adminUser.role !== 'ADMIN') {
    throw new Error('Access denied: Admin role required')
  }
  
  return adminUser
}

export async function requireManagerOrAdmin(): Promise<AdminUser> {
  const adminUser = await getAdminUser()
  
  if (!adminUser) {
    throw new Error('Access denied: Manager or Admin privileges required')
  }
  
  if (adminUser.role !== 'ADMIN' && adminUser.role !== 'MANAGER') {
    throw new Error('Access denied: Manager or Admin role required')
  }
  
  return adminUser
}

export function canWrite(role: UserRole): boolean {
  return role === 'ADMIN'
}

export function canRead(role: UserRole): boolean {
  return role === 'ADMIN' || role === 'MANAGER'
}