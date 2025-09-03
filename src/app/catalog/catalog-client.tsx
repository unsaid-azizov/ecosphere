'use client';

import { CatalogFilters } from '@/components/catalog-filters';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { Product } from '@/types/product';

interface CatalogClientProps {
  initialProducts: Product[];
  categories: string[];
  priceRange: { min: number; max: number };
}

export function CatalogClient({ 
  initialProducts, 
  categories, 
  priceRange 
}: CatalogClientProps) {
  const {
    products,
    filteredProducts,
    filters,
    setFilters
  } = useProducts({ initialProducts });

  return (
    <div className="space-y-8">
      <CatalogFilters
        categories={categories}
        priceRange={priceRange}
        filters={filters}
        onFiltersChange={setFilters}
        totalProducts={products.length}
        filteredCount={filteredProducts.length}
      />

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0121 12c0-4.411-3.589-8-8-8s-8 3.589-8 8c0 2.152.851 4.103 2.233 5.543L3 21l4.194-1.194A7.962 7.962 0 0012 21c4.411 0 8-3.589 8-8z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Товары не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить параметры поиска или очистить фильтры
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}