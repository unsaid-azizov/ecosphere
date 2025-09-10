import { NextRequest, NextResponse } from 'next/server'
import { getAdminUser } from '@/lib/admin-auth'

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser()
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    })
  } catch (error) {
    console.error('Error getting admin user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}