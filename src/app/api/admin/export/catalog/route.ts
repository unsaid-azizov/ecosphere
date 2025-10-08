import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Fetch all products
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // Prepare products data
    const productsData = products.map(p => ({
      ID: p.id,
      'Название': p.name,
      'Описание': p.description || '',
      'Цена': p.price,
      'Категория': p.category,
      'Артикул': p.article,
      'Количество': p.stockQuantity,
      'Доступен': p.isAvailable ? 'Да' : 'Нет',
      'Изображения': p.images.join('; '),
      'Создан': p.createdAt.toISOString(),
      'Обновлен': p.updatedAt.toISOString(),
    }));

    // Add worksheet
    XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(productsData), 'Товары');

    // Generate Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Return Excel file
    return new NextResponse(excelBuffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="catalog-${new Date().toISOString().split('T')[0]}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error exporting catalog:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
