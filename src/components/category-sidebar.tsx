'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/search-bar';
import { Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategorySidebarProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryClick: (category: string) => void;
  onClearAll: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearAllFilters: () => void;
  onRemoveSearchFilter: () => void;
}

export function CategorySidebar({ 
  categories, 
  selectedCategories, 
  onCategoryClick,
  onClearAll,
  searchValue,
  onSearchChange,
  onClearAllFilters,
  onRemoveSearchFilter
}: CategorySidebarProps) {
  return (
    <div className="w-full lg:w-80 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <div className="mb-6">
          <SearchBar 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Поиск товаров..."
          />
        </div>
        
        <h2 className="text-lg font-semibold text-forest-800 mb-4">
          Выберите категорию:
        </h2>
        
        {selectedCategories.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-gray-500 hover:text-forest-600 p-0 h-auto font-normal mb-4"
          >
            Очистить все ({selectedCategories.length})
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selectedCategories.includes(category);
          return (
            <Button
              key={category}
              variant="ghost"
              className={cn(
                "w-full justify-start text-left h-auto py-3 px-4 rounded-lg transition-all duration-200 border-0 text-sm font-normal",
                isSelected
                  ? "bg-lime-100 text-forest-800 hover:bg-lime-200 font-medium"
                  : "text-gray-700 hover:bg-gray-50 hover:text-forest-700"
              )}
              onClick={() => onCategoryClick(category)}
            >
              <span className="line-clamp-2 text-left">
                {category}
              </span>
              {isSelected && (
                <div className="ml-auto w-2 h-2 bg-lime-400 rounded-full flex-shrink-0" />
              )}
            </Button>
          );
        })}
        
        {categories.length === 0 && (
          <div className="text-gray-500 text-sm py-4 text-center">
            Категории не найдены
          </div>
        )}
      </div>

      {/* Раздел фильтров */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Фильтры</span>
          </div>
          {(searchValue || selectedCategories.length > 0) && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAllFilters}
              className="text-gray-500 hover:text-forest-600 p-0 h-auto font-normal"
            >
              <X className="h-4 w-4 mr-1" />
              Очистить все
            </Button>
          )}
        </div>

        {(searchValue || selectedCategories.length > 0) && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-700">Активные фильтры</h3>
            <div className="flex flex-wrap gap-2">
              {searchValue && (
                <Badge className="gap-1 bg-forest-100 text-forest-800 hover:bg-forest-200">
                  Поиск: "{searchValue}"
                  <button 
                    onClick={onRemoveSearchFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedCategories.map((category) => (
                <Badge key={category} className="gap-1 bg-sage-100 text-sage-800 hover:bg-sage-200">
                  {category}
                  <button 
                    onClick={() => onCategoryClick(category)}
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
  );
}