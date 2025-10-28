import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs'; // Force Node.js runtime, not Edge

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting database export...');

    // Fetch all data from database - ALL FIELDS, NO EXCLUSIONS
    const [users, orders, orderItems, products, favorites, cartItems, discounts, posts] = await Promise.all([
      prisma.user.findMany(), // ALL fields
      prisma.order.findMany(), // ALL fields
      prisma.orderItem.findMany(), // ALL fields
      prisma.product.findMany(), // ALL fields
      prisma.favorite.findMany(), // ALL fields
      prisma.cartItem.findMany(), // ALL fields
      prisma.personalDiscount.findMany(), // ALL fields
      prisma.post.findMany(), // ALL fields
    ]);

    // Create workbook with multiple sheets
    const workbook = XLSX.utils.book_new();

    // Add Users sheet (ALL fields)
    const usersData = users.map(u => ({
      ID: u.id,
      Email: u.email,
      Password: u.password, // Hashed password
      'Тип': u.userType,
      'Роль': u.role,

      // Физ. лицо
      'Имя': u.firstName || '',
      'Фамилия': u.lastName || '',
      'Телефон': u.phone || '',

      // Общие
      'ИНН': u.inn || '',

      // ИП
      'ИП Полное имя': u.ipFullName || '',
      'ИП Краткое имя': u.ipShortName || '',
      'ИП Адрес регистрации': u.ipRegistrationAddress || '',
      'ИП Фактический адрес': u.ipActualAddress || '',
      'ИП ОГРНИП': u.ipOgrnip || '',
      'ИП Банк': u.ipBankName || '',
      'ИП БИК': u.ipBik || '',
      'ИП Корр. счет': u.ipCorrAccount || '',
      'ИП Расчетный счет': u.ipCheckingAccount || '',
      'ИП ОКВЭД': u.ipOkved || '',
      'ИП Налоговая система': u.ipTaxSystem || '',
      'ИП НДС': u.ipVatStatus || '',

      // ООО
      'ООО Полное имя': u.oooFullName || '',
      'ООО Краткое имя': u.oooShortName || '',
      'ООО Юридический адрес': u.oooLegalAddress || '',
      'ООО Фактический адрес': u.oooActualAddress || '',
      'КПП': u.kpp || '',
      'ООО ОГРН': u.oooOgrn || '',
      'ООО Директор': u.oooDirector || '',
      'ООО Бухгалтер': u.oooAccountant || '',
      'ООО Уполномоченное лицо': u.oooAuthorizedPerson || '',
      'ООО Банк': u.oooBankName || '',
      'ООО БИК': u.oooBik || '',
      'ООО Корр. счет': u.oooCorrAccount || '',
      'ООО Расчетный счет': u.oooCheckingAccount || '',
      'ООО ОКВЭД': u.oooOkved || '',
      'ООО Налоговая система': u.oooTaxSystem || '',
      'ООО НДС': u.oooVatStatus || '',

      // Устаревшие
      'ИП Имя (старое)': u.ipName || '',
      'Компания (старое)': u.companyName || '',
      'Юр. адрес (старое)': u.legalAddress || '',

      // Скидки
      'Процент скидки': u.discountPercent,
      'VIP': u.isVip ? 'Да' : 'Нет',
      'Баллы лояльности': u.loyaltyPoints,

      // Даты
      'Создан': u.createdAt.toISOString(),
      'Обновлен': u.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(usersData), 'Пользователи');

    // Add Orders sheet (ALL fields)
    const ordersData = orders.map(o => ({
      ID: o.id,
      'Номер заказа': o.orderNumber,
      'ID Пользователя': o.userId,
      'Статус': o.status,
      'Общая сумма': o.totalAmount,
      'Email контакта': o.contactEmail,
      'Телефон контакта': o.contactPhone || '',
      'Адрес доставки': o.deliveryAddress || '',
      'Создан': o.createdAt.toISOString(),
      'Обновлен': o.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(ordersData), 'Заказы');

    // Add Order Items sheet
    const orderItemsData = orderItems.map(i => ({
      ID: i.id,
      'ID Заказа': i.orderId,
      'ID Товара': i.productId,
      'Название': i.productName,
      'Категории': (i as any).productCategories ? (i as any).productCategories.join('; ') : '',
      'Артикул': i.productArticle,
      'Количество': i.quantity,
      'Цена': i.price,
      'Создан': i.createdAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(orderItemsData), 'Позиции заказов');

    // Add Products sheet
    const productsData = products.map(p => ({
      ID: p.id,
      'Название': p.name,
      'Описание': p.description || '',
      'Цена': p.price,
      'Категории': p.categories.join('; '),
      'Артикул': p.article,
      'Количество': p.stockQuantity,
      'Доступен': p.isAvailable ? 'Да' : 'Нет',
      'Изображения': p.images.join('; '),
      'Создан': p.createdAt.toISOString(),
      'Обновлен': p.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productsData), 'Товары');

    // Add Favorites sheet
    const favoritesData = favorites.map(f => ({
      ID: f.id,
      'ID Пользователя': f.userId,
      'ID Товара': f.productId,
      'Создан': f.createdAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(favoritesData), 'Избранное');

    // Add Cart Items sheet
    const cartData = cartItems.map(c => ({
      ID: c.id,
      'ID Пользователя': c.userId,
      'ID Товара': c.productId,
      'Количество': c.quantity,
      'Создан': c.createdAt.toISOString(),
      'Обновлен': c.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(cartData), 'Корзины');

    // Add Discounts sheet (ALL fields)
    const discountsData = discounts.map(d => ({
      ID: d.id,
      'Название': d.name,
      'Описание': d.description || '',
      'ID Пользователя': d.userId || '',
      'Тип пользователя': d.userType || '',
      'Тип скидки': d.discountType,
      'ID Товара': d.productId || '',
      'Категория': d.category || '',
      'Процент скидки': d.discountPercent,
      'Действует с': d.validFrom.toISOString(),
      'Действует до': d.validUntil ? d.validUntil.toISOString() : '',
      'Активна': d.isActive ? 'Да' : 'Нет',
      'ID Создателя': d.createdBy,
      'Создан': d.createdAt.toISOString(),
      'Обновлен': d.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(discountsData), 'Скидки');

    // Add Posts sheet (ALL fields)
    const postsData = posts.map(p => ({
      ID: p.id,
      'Заголовок': p.title,
      'Slug': p.slug,
      'Анонс': p.excerpt || '',
      'Содержание': p.content,
      'Тип контента': p.contentType,
      'Блоки': p.blocks ? JSON.stringify(p.blocks) : '',
      'Обложка': p.coverImage || '',
      'Изображения': p.images.join('; '),
      'Статус': p.status,
      'Рекомендуемый': p.featured ? 'Да' : 'Нет',
      'Просмотры': p.views,
      'Категория': p.category || '',
      'Теги': p.tags.join(', '),
      'SEO Заголовок': p.metaTitle || '',
      'SEO Описание': p.metaDescription || '',
      'ID Автора': p.authorId,
      'Опубликован': p.publishedAt ? p.publishedAt.toISOString() : '',
      'Создан': p.createdAt.toISOString(),
      'Обновлен': p.updatedAt.toISOString(),
    }));
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(postsData), 'Посты');

    // Generate Excel file as buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="ecosphere-export-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
