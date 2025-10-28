import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { notifyNewOrder } from '@/lib/telegram-bot';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, phone, firstName, lastName, deliveryAddress, items } = body;

    // Validate required fields
    if (!email || !phone || !firstName || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Отсутствуют обязательные поля' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Неверный формат email' },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
    });

    // If user exists and is not a guest, prompt to login
    if (user && !user.isGuest) {
      return NextResponse.json(
        { error: 'Пользователь с таким email уже зарегистрирован. Пожалуйста, войдите в систему.' },
        { status: 409 }
      );
    }

    // Create or update guest user
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          password: null,
          userType: 'INDIVIDUAL',
          role: 'USER',
          isGuest: true,
          firstName,
          lastName: lastName || null,
          phone,
        },
      });
    } else {
      // Update guest user info
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          firstName,
          lastName: lastName || null,
          phone,
        },
      });
    }

    // Get product details
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: items.map((item: any) => item.productId),
        },
      },
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Товары не найдены' },
        { status: 400 }
      );
    }

    // Calculate total
    const totalAmount = items.reduce((sum: number, item: any) => {
      const product = products.find(p => p.id === item.productId);
      return sum + (product ? product.price * item.quantity : 0);
    }, 0);

    // Generate order number
    const orderNumber = `ORD-${Date.now()}`;

    // Create order in transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user!.id,
          totalAmount,
          contactEmail: email,
          contactPhone: phone,
          deliveryAddress: deliveryAddress || null,
        },
      });

      // Add order items
      const orderItems = await Promise.all(
        items.map((item: any) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) throw new Error(`Товар ${item.productId} не найден`);

          return tx.orderItem.create({
            data: {
              orderId: newOrder.id,
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              productName: product.name,
              productCategories: product.categories || [],
              productArticle: product.article || product.id,
            },
          });
        })
      );

      return { ...newOrder, orderItems };
    });

    // Send Telegram notification
    try {
      await notifyNewOrder({
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        userEmail: email,
        userName: `${firstName}${lastName ? ' ' + lastName : ''} (Гость)`,
        itemsCount: order.orderItems.length,
        items: order.orderItems.map(item => ({
          name: item.productName,
          article: item.productArticle,
          quantity: item.quantity,
          price: item.price,
        })),
        contactPhone: phone,
        deliveryAddress: deliveryAddress || undefined,
      });
    } catch (error) {
      console.error('Failed to send Telegram notification:', error);
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Ошибка создания гостевого заказа:', error);
    return NextResponse.json(
      {
        error: 'Внутренняя ошибка сервера',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
