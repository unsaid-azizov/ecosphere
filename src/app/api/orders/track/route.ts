import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const orderNumber = searchParams.get('orderNumber');

    if (!email || !orderNumber) {
      return NextResponse.json(
        { error: 'Email и номер заказа обязательны' },
        { status: 400 }
      );
    }

    // Find order by order number and email
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        contactEmail: email,
      },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Заказ не найден' },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Внутренняя ошибка сервера' },
      { status: 500 }
    );
  }
}
