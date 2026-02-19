import { Product } from '@/types/product';
import fs from 'fs';
import path from 'path';

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

        products.push({
          id,
          article,
          name,
          description,
          price,
          categories,
          images: productImages
        });
      } else {
        invalidLines++;
        console.log(`Invalid line ${i}: ${values.length} columns, expected 6+. Line: "${trimmedLine.substring(0, 100)}..."`);
      }
      
      currentLine = '';
    }
  }
  
  console.log(`CSV parsing complete: ${products.length} products, ${skippedLines} empty lines, ${invalidLines} invalid lines`);
  return products;
}

function parseCSVLine(line: string): string[] {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      inQuotes = !inQuotes;
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

function getProductImages(index: number): string[] {
  const productId = index + 1;
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');

  const images: string[] = [];

  try {
    if (fs.existsSync(uploadsDir)) {
      const prefix = `product_${productId}_`;
      const files = fs.readdirSync(uploadsDir)
        .filter(f => f.startsWith(prefix) && /\.(jpg|jpeg|png|webp)$/i.test(f))
        .sort();

      for (const file of files) {
        images.push(`/uploads/products/${file}`);
      }
    }
  } catch (error) {
    console.log(`Error checking images for product ${productId}:`, error);
  }

  return images.length > 0 ? images : [`/uploads/products/product_${productId}_1.jpg`];
}

export async function getProducts(): Promise<Product[]> {
  try {
    const csvPath = path.join(process.cwd(), 'data', 'items.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    return parseCSV(csvContent);
  } catch (error) {
    console.error('Error reading CSV:', error);
    return [];
  }
}

export function getCategories(products: Product[]): string[] {
  // Flatten all categories from all products and get unique values
  const allCategories: string[] = [];
  products.forEach(p => {
    if (p.categories && Array.isArray(p.categories)) {
      allCategories.push(...p.categories);
    }
  });
  const categories = [...new Set(allCategories)].filter(Boolean);
  return categories.sort();
}

export function getPriceRange(products: Product[]): { min: number; max: number } {
  const prices = products.map(p => p.price).filter(p => p > 0);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  };
}