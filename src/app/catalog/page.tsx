import { Suspense } from 'react';
import { CatalogClient } from './catalog-client';
import { Navbar } from '@/components/navbar';
import { getServerDiscounts, type ServerDiscountResult } from '@/lib/server-discounts';

async function fetchProducts() {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/products`, {
    headers: {
      'Cache-Control': 'public, max-age=300'
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  return response.json();
}

export default async function CatalogPage() {
  let discounts: ServerDiscountResult[] = [];

  try {
    // Get all products for discount calculation
    const products = await fetchProducts();

    if (products.length > 0) {
      // Get discounts for all products
      discounts = await getServerDiscounts(
        products.map((p: any) => ({
          id: p.id,
          price: p.price,
          categories: p.categories
        }))
      );
    }
  } catch (error) {
    console.error('Ошибка загрузки скидок для каталога:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
        <Suspense fallback={<div>Загрузка...</div>}>
          <CatalogClient discounts={discounts} />
        </Suspense>
        </div>
      </div>
    </div>
  );
}