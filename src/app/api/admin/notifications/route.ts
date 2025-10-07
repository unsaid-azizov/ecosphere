import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Count pending orders (new orders)
    const pendingOrdersCount = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    });

    // Count users registered in last 7 days (new users)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const newUsersCount = await prisma.user.count({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        },
        role: 'USER' // Only count regular users, not admins/managers
      }
    });

    return NextResponse.json({
      pendingOrders: pendingOrdersCount,
      newUsers: newUsersCount
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
