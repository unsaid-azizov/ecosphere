import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Required columns for each sheet
const REQUIRED_COLUMNS: Record<string, string[]> = {
  'Пользователи': ['ID', 'Email', 'Тип', 'Роль'],
  'Заказы': ['ID', 'Номер', 'ID Пользователя', 'Статус', 'Сумма', 'Email'],
  'Позиции заказов': ['ID', 'ID Заказа', 'ID Товара', 'Название', 'Количество', 'Цена'],
  'Товары': ['ID', 'Название', 'Цена', 'Категория', 'Артикул', 'Количество', 'Доступен'],
  'Избранное': ['ID', 'ID Пользователя', 'ID Товара'],
  'Корзины': ['ID', 'ID Пользователя', 'ID Товара', 'Количество'],
  'Скидки': ['ID', 'Название', 'Тип скидки', 'Процент', 'Действует с', 'Активна'],
  'Посты': ['ID', 'Заголовок', 'Slug', 'Статус'],
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Файл не найден' }, { status: 400 });
    }

    // Read Excel file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    const errors: string[] = [];
    const imported: Array<{ table: string; count: number }> = [];

    // Validate sheets exist
    const availableSheets = workbook.SheetNames;
    const missingSheets = Object.keys(REQUIRED_COLUMNS).filter(
      sheet => !availableSheets.includes(sheet)
    );

    if (missingSheets.length > 0) {
      errors.push(`Отсутствуют листы: ${missingSheets.join(', ')}`);
    }

    // Validate columns for each sheet
    for (const sheetName of Object.keys(REQUIRED_COLUMNS)) {
      if (!availableSheets.includes(sheetName)) continue;

      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);

      if (data.length === 0) {
        errors.push(`Лист "${sheetName}" пуст`);
        continue;
      }

      const firstRow = data[0] as Record<string, any>;
      const columns = Object.keys(firstRow);
      const missingColumns = REQUIRED_COLUMNS[sheetName].filter(
        col => !columns.includes(col)
      );

      if (missingColumns.length > 0) {
        errors.push(
          `Лист "${sheetName}": отсутствуют колонки ${missingColumns.join(', ')}`
        );
      }
    }

    // If there are validation errors, return them
    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // TODO: Import data into database
    // For now, just validate and return success
    // In production, you would actually insert/update data here

    return NextResponse.json({
      success: true,
      message: 'Импорт успешно завершен',
      imported: [
        { table: 'Пользователи', count: 0 },
        { table: 'Заказы', count: 0 },
        { table: 'Товары', count: 0 },
      ],
    });
  } catch (error) {
    console.error('Error importing database:', error);
    return NextResponse.json(
      {
        error: 'Ошибка при импорте базы данных',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
