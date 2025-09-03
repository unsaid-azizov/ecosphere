'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  selectedFilters: string[];
}

interface CatalogFiltersProps {
  categories: string[];
  priceRange: { min: number; max: number };
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  totalProducts: number;
  filteredCount: number;
}

export function CatalogFilters({
  categories,
  priceRange,
  filters,
  onFiltersChange,
  totalProducts,
  filteredCount
}: CatalogFiltersProps) {
  const [showAllCategories, setShowAllCategories] = useState(false);
  const displayCategories = showAllCategories ? categories : categories.slice(0, 6);

  const handleCategoryClick = (category: string) => {
    const currentCategories = filters.categories || [];
    const isSelected = currentCategories.includes(category);
    
    let newCategories;
    if (isSelected) {
      // Remove category if already selected
      newCategories = currentCategories.filter(cat => cat !== category);
    } else {
      // Add category to selection
      newCategories = [...currentCategories, category];
    }
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      priceRange: [priceRange.min, priceRange.max],
      selectedFilters: []
    });
  };

  const removeFilter = (filterType: string, value?: string) => {
    if (filterType === 'search') {
      onFiltersChange({ ...filters, search: '' });
    } else if (filterType === 'category' && value) {
      const newCategories = (filters.categories || []).filter(cat => cat !== value);
      onFiltersChange({ ...filters, categories: newCategories });
    }
  };

  const hasActiveFilters = filters.search || (filters.categories?.length > 0) || filters.selectedFilters.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Каталог товаров</h1>
          <p className="text-muted-foreground">
            Найдено {filteredCount} из {totalProducts} товаров
          </p>
        </div>

        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Поиск товаров..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
            className="pl-9 h-10 bg-white border-gray-200 focus:border-gray-300"
          />
          {filters.search && (
            <button
              onClick={() => removeFilter('search')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Фильтры</span>
          </div>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить все
            </Button>
          )}
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Категории</h3>
            <div className="flex flex-wrap gap-2">
              {displayCategories.map((category) => {
                const isSelected = filters.categories?.includes(category) || false;
                return (
                  <Badge
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer transition-colors hover:bg-gray-100",
                      isSelected && "bg-gray-900 hover:bg-gray-800 text-white"
                    )}
                    onClick={() => handleCategoryClick(category)}
                  >
                    {category}
                  </Badge>
                );
              })}
              {categories.length > 6 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllCategories(!showAllCategories)}
                  className="h-6 px-2 text-xs text-muted-foreground"
                >
                  {showAllCategories ? 'Свернуть' : `+${categories.length - 6} еще`}
                </Button>
              )}
            </div>
          </div>

          {hasActiveFilters && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Активные фильтры</h3>
              <div className="flex flex-wrap gap-2">
                {filters.search && (
                  <Badge variant="secondary" className="gap-1">
                    Поиск: {`"${filters.search}"`}
                    <button 
                      onClick={() => removeFilter('search')}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {(filters.categories || []).map((category) => (
                  <Badge key={category} variant="secondary" className="gap-1">
                    {category}
                    <button 
                      onClick={() => removeFilter('category', category)}
                      className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}