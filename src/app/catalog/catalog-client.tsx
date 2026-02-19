'use client';

import { CatalogFilters } from '@/components/catalog-filters';
import { CategorySidebar } from '@/components/category-sidebar';
import { ProductCard } from '@/components/product-card';
import { useProducts } from '@/hooks/use-products';
import { type ServerDiscountResult } from '@/lib/server-discounts';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';

interface CatalogClientProps {
  discounts: ServerDiscountResult[]
}

export function CatalogClient({ discounts }: CatalogClientProps) {
  const {
    products,
    filteredProducts,
    filters,
    setFilters,
    categories,
    priceRange,
    loading,
    error
  } = useProducts();

  // Helper function to find discount for a product
  const getProductDiscount = (productId: string) => {
    return discounts.find(d => d.productId === productId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
          <p className="mt-4 text-gray-600">Загрузка товаров...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-red-500 mb-4">
          <svg className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-lime-400 text-forest-800 rounded-md hover:bg-lime-500"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  const handleCategoryClick = (category: string) => {
    const currentCategories = filters.categories || [];
    const isSelected = currentCategories.includes(category);
    
    let newCategories;
    if (isSelected) {
      newCategories = currentCategories.filter(cat => cat !== category);
    } else {
      newCategories = [...currentCategories, category];
    }
    
    setFilters({
      ...filters,
      categories: newCategories
    });
  };

  const clearAllCategories = () => {
    setFilters({
      ...filters,
      categories: []
    });
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      categories: [],
      priceRange: [priceRange.min, priceRange.max],
      selectedFilters: []
    });
  };

  const removeSearchFilter = () => {
    setFilters({ ...filters, search: '' });
  };

  const handleExportCatalog = () => {
    try {
      // Prepare data for export
      const exportData = filteredProducts.map(product => {
        const discount = getProductDiscount(product.id);
        const finalPrice = discount
          ? product.price * (1 - discount.discountPercent / 100)
          : product.price;

        return {
          'Артикул': product.article,
          'Название': product.name,
          'Описание': product.description || '',
          'Категории': product.categories.join('; '),
          'Цена': product.price,
          'Скидка %': discount?.discountPercent || 0,
          'Цена со скидкой': finalPrice,
          'Название скидки': discount?.discountName || '',
          'Количество': product.stockQuantity,
          'Доступен': product.isAvailable ? 'Да' : 'Нет',
        };
      });

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Каталог');

      // Generate Excel file
      const excelBuffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      // Create blob and download
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `catalog-${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, 100);
    } catch (error) {
      console.error('Error exporting catalog:', error);
      alert('Ошибка при экспорте каталога');
    }
  };

  return (
    <div className="space-y-8">
      <div className="lg:grid lg:grid-cols-[320px_1fr] lg:gap-8 flex flex-col gap-8">
        {/* Sidebar с категориями */}
        <div>
          <CategorySidebar
            categories={categories}
            selectedCategories={filters.categories || []}
            onCategoryClick={handleCategoryClick}
            onClearAll={clearAllCategories}
            searchValue={filters.search}
            onSearchChange={(value) => setFilters({ ...filters, search: value })}
            onClearAllFilters={clearAllFilters}
            onRemoveSearchFilter={removeSearchFilter}
          />
        </div>

        {/* Основной контент */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CatalogFilters
              categories={categories}
              priceRange={priceRange}
              filters={filters}
              onFiltersChange={setFilters}
              totalProducts={products.length}
              filteredCount={filteredProducts.length}
            />

            {filteredProducts.length > 0 && (
              <Button
                onClick={handleExportCatalog}
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-lime-50 border-lime-300 text-forest-800"
              >
                <Download className="h-4 w-4" />
                Экспорт ({filteredProducts.length})
              </Button>
            )}
          </div>

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
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-4 lg:gap-6 w-full justify-items-stretch">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard 
                    product={product} 
                    index={index}
                    discountPercent={getProductDiscount(product.id)?.discountPercent || 0}
                    discountName={getProductDiscount(product.id)?.discountName}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}