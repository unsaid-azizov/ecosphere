import { Suspense } from 'react';
import { getProducts, getCategories, getPriceRange } from '@/lib/data';
import { CatalogClient } from './catalog-client';
import { Navbar } from '@/components/navbar';

export default async function CatalogPage() {
  const products = await getProducts();
  const categories = getCategories(products);
  const priceRange = getPriceRange(products);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Загрузка...</div>}>
          <CatalogClient 
            initialProducts={products}
            categories={categories}
            priceRange={priceRange}
          />
        </Suspense>
      </div>
    </div>
  );
}