import { Product } from '@/types/product';

// Клиентская версия без использования fs
export function parseCSV(csvContent: string): Product[] {
  // Split by lines but handle multiline quoted fields properly
  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  const products: Product[] = [];
  
  console.log(`CSV parsing: Total lines: ${lines.length}, Header: ${headers.join(', ')}`);
  let skippedLines = 0;
  let invalidLines = 0;
  let currentLine = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle multiline fields in quotes
    if (inQuotes) {
      currentLine += '\n' + line;
    } else {
      currentLine = line;
    }
    
    // Count quotes to determine if we're inside a quoted field
    const quoteCount = (currentLine.match(/"/g) || []).length;
    inQuotes = quoteCount % 2 !== 0;
    
    // Process line only when we have a complete record (not in quotes)
    if (!inQuotes) {
      const trimmedLine = currentLine.trim();
      if (!trimmedLine) {
        skippedLines++;
        continue;
      }

      const values = parseCSVLine(trimmedLine);
      if (values.length >= 6) {
        const id = values[0]?.replace(/\ufeff/, '') || '';
        const article = values[1] || '';
        const name = values[2] || '';
        const description = values[3] || '';
        const price = parseFloat(values[4]) || 0;
        const categoryField = values[5] || '';

        // Parse categories - support both single and multiple categories separated by semicolon
        const categories = categoryField.split(';').map(c => c.trim()).filter(Boolean);

        // Use product index instead of article number for images (start from 0)
        const productImages = getProductImages(products.length);

        if (id && name && price > 0) {
          products.push({
            id,
            article,
            name,
            description,
            price,
            categories,
            images: productImages,
            availability: 'В наличии'
          });
        } else {
          invalidLines++;
          console.warn(`Invalid product on line ${i + 1}:`, { id, name, price });
        }
      } else {
        invalidLines++;
        console.warn(`Insufficient data on line ${i + 1}:`, values);
      }
      
      currentLine = '';
    }
  }

  console.log(`CSV parsing complete: ${products.length} products, ${skippedLines} skipped, ${invalidLines} invalid`);
  return products;
}

export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function getProductImages(index: number): string[] {
  const productId = index + 1;
  return [`/uploads/products/product_${productId}_1.jpg`];
}

// Предзагруженные продукты для клиентской стороны
export const preloadedProducts: Product[] = [
  {
    id: '1',
    article: 'ECO001',
    name: 'Биоразлагаемые пакеты 25x30 см',
    description: 'Экологически чистые пакеты из кукурузного крахмала',
    price: 150,
    categories: ['Упаковочные материалы'],
    images: ['/placeholder-product-1.svg'],
    availability: 'В наличии'
  },
  {
    id: '2',
    article: 'ECO002',
    name: 'Крафт-бумага рулон 60см',
    description: 'Натуральная упаковочная бумага из переработанного сырья',
    price: 280,
    categories: ['Упаковочные материалы'],
    images: ['/placeholder-product-2.svg'],
    availability: 'В наличии'
  },
  {
    id: '3',
    article: 'ECO003',
    name: 'Мыло органическое 100г',
    description: 'Натуральное мыло без химических добавок',
    price: 85,
    categories: ['Гигиена и косметика'],
    images: ['/placeholder-product-3.svg'],
    availability: 'В наличии'
  },
  {
    id: '4',
    article: 'ECO004',
    name: 'Бамбуковая посуда набор',
    description: 'Экологичная альтернатива пластиковой посуде',
    price: 450,
    categories: ['Посуда и принадлежности'],
    images: ['/placeholder-product-4.svg'],
    availability: 'В наличии'
  },
  {
    id: '5',
    article: 'ECO005',
    name: 'Чистящее средство эко 500мл',
    description: 'Биоразлагаемое универсальное чистящее средство',
    price: 195,
    categories: ['Бытовая химия'],
    images: ['/placeholder-product-5.svg'],
    availability: 'В наличии'
  },
  {
    id: '6',
    article: 'ECO006',
    name: 'Полотенца из бамбука 6 шт',
    description: 'Антибактериальные полотенца из бамбукового волокна',
    price: 320,
    categories: ['Текстиль'],
    images: ['/placeholder-product-6.svg'],
    availability: 'В наличии'
  },
  {
    id: '7',
    article: 'ECO007',
    name: 'Стаканы биоразлагаемые 50 шт',
    description: 'Одноразовые стаканы из растительного сырья',
    price: 125,
    categories: ['Посуда и принадлежности'],
    images: ['/placeholder-product-7.svg'],
    availability: 'В наличии'
  },
  {
    id: '8',
    article: 'ECO008',
    name: 'Контейнеры для компоста 3л',
    description: 'Контейнеры для органических отходов с фильтром',
    price: 680,
    categories: ['Утилизация отходов'],
    images: ['/placeholder-product-8.svg'],
    availability: 'В наличии'
  },
  {
    id: '9',
    article: 'ECO009',
    name: 'Туалетная бумага переработанная 12 рул',
    description: 'Мягкая туалетная бумага из вторичного сырья',
    price: 240,
    categories: ['Гигиена и косметика'],
    images: ['/placeholder-product-9.svg'],
    availability: 'В наличии'
  },
  {
    id: '10',
    article: 'ECO010',
    name: 'Салфетки многоразовые 10 шт',
    description: 'Моющиеся салфетки из органического хлопка',
    price: 180,
    categories: ['Текстиль'],
    images: ['/placeholder-product-10.svg'],
    availability: 'В наличии'
  },
  {
    id: '11',
    article: 'ECO011',
    name: 'Освежитель воздуха эфирные масла',
    description: 'Натуральный освежитель на основе эфирных масел',
    price: 290,
    categories: ['Бытовая химия'],
    images: ['/placeholder-product-11.svg'],
    availability: 'В наличии'
  },
  {
    id: '12',
    article: 'ECO012',
    name: 'Мешки для мусора биоразлагаемые 20л',
    description: 'Прочные мусорные мешки из растительных полимеров',
    price: 165,
    categories: ['Утилизация отходов'],
    images: ['/placeholder-product-12.svg'],
    availability: 'В наличии'
  }
];

export function getProducts(): Product[] {
  return preloadedProducts;
}