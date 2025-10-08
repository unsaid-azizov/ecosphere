import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const REQUIRED_COLUMNS = ['ID', 'Название', 'Цена', 'Категория', 'Артикул', 'Количество', 'Доступен'];

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

    // Check if "Товары" sheet exists
    if (!workbook.SheetNames.includes('Товары')) {
      return NextResponse.json(
        { errors: ['Лист "Товары" не найден в файле'] },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets['Товары'];
    const data = XLSX.utils.sheet_to_json(sheet) as any[];

    if (data.length === 0) {
      return NextResponse.json(
        { errors: ['Лист "Товары" пуст'] },
        { status: 400 }
      );
    }

    // Validate required columns
    const firstRow = data[0];
    const columns = Object.keys(firstRow);
    const missingColumns = REQUIRED_COLUMNS.filter(col => !columns.includes(col));

    if (missingColumns.length > 0) {
      return NextResponse.json(
        { errors: [`Отсутствуют обязательные колонки: ${missingColumns.join(', ')}`] },
        { status: 400 }
      );
    }

    // Import products
    let importedCount = 0;
    let updatedCount = 0;
    let createdCount = 0;

    for (const row of data) {
      try {
        const productData = {
          name: row['Название'],
          description: row['Описание'] || null,
          price: parseFloat(row['Цена']),
          category: row['Категория'],
          article: row['Артикул'],
          stockQuantity: parseInt(row['Количество']),
          isAvailable: row['Доступен'] === 'Да',
          images: row['Изображения'] ? row['Изображения'].split('; ').filter(Boolean) : [],
        };

        // Check if product exists
        const existing = await prisma.product.findUnique({
          where: { id: row['ID'] },
        });

        if (existing) {
          await prisma.product.update({
            where: { id: row['ID'] },
            data: productData,
          });
          updatedCount++;
        } else {
          await prisma.product.create({
            data: {
              id: row['ID'],
              ...productData,
            },
          });
          createdCount++;
        }

        importedCount++;
      } catch (rowError) {
        console.error(`Error importing row:`, row, rowError);
        errors.push(`Ошибка в строке с ID ${row['ID']}: ${rowError instanceof Error ? rowError.message : 'Unknown error'}`);
      }
    }

    if (errors.length > 0) {
      return NextResponse.json(
        {
          errors,
          imported: [{
            table: 'Товары',
            count: importedCount,
            details: `Создано: ${createdCount}, Обновлено: ${updatedCount}`,
          }],
        },
        { status: 207 } // Multi-status
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Импорт каталога успешно завершен',
      imported: [{
        table: 'Товары',
        count: importedCount,
        details: `Создано: ${createdCount}, Обновлено: ${updatedCount}`,
      }],
    });
  } catch (error) {
    console.error('Error importing catalog:', error);
    return NextResponse.json(
      {
        errors: [
          'Ошибка при импорте каталога',
          error instanceof Error ? error.message : 'Unknown error',
        ],
      },
      { status: 500 }
    );
  }
}
