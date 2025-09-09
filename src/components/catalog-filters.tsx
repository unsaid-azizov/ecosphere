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
  const displayCategories = categories;

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

      </div>

    </div>
  );
}