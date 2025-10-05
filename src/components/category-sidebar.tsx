'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchBar } from '@/components/search-bar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
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
  const CategoryButton = ({ category }: { category: string }) => {
    const isSelected = selectedCategories.includes(category);
    return (
      <Button
        key={category}
        variant="ghost"
        className={cn(
          "w-full justify-start text-left h-auto py-3 px-4 rounded-lg transition-all duration-200 border-0 text-sm font-normal",
          isSelected
            ? "bg-lime-100 text-forest-800 hover:bg-lime-200 hover:text-forest-800 font-medium"
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
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-4 lg:p-6">
      <div className="mb-4 lg:mb-6">
        <div className="mb-4 lg:mb-6">
          <SearchBar 
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Поиск товаров..."
          />
        </div>
        
        {/* Desktop: обычный заголовок */}
        <div className="hidden lg:block">
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
        
        {/* Mobile: кнопка очистки над аккордеоном */}
        <div className="lg:hidden">
          {selectedCategories.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-gray-500 hover:text-forest-600 p-0 h-auto font-normal mb-2"
            >
              Очистить все ({selectedCategories.length})
            </Button>
          )}
        </div>
      </div>

      {/* Desktop: обычный список */}
      <div className="hidden lg:block space-y-2">
        {categories.map((category) => (
          <CategoryButton key={category} category={category} />
        ))}
        
        {categories.length === 0 && (
          <div className="text-gray-500 text-sm py-4 text-center">
            Категории не найдены
          </div>
        )}
      </div>

      {/* Mobile: аккордеон */}
      <div className="lg:hidden">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="categories" className="border-forest-200">
            <AccordionTrigger className="hover:no-underline text-forest-800 hover:text-forest-800 [&:hover]:text-forest-800 font-semibold">
              Категории {selectedCategories.length > 0 && `(${selectedCategories.length})`}
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {categories.map((category) => (
                  <CategoryButton key={category} category={category} />
                ))}
                
                {categories.length === 0 && (
                  <div className="text-gray-500 text-sm py-4 text-center">
                    Категории не найдены
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Раздел фильтров */}
      {(searchValue || selectedCategories.length > 0) && (
        <>
          {/* Desktop: обычное отображение фильтров */}
          <div className="hidden lg:block mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Фильтры</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearAllFilters}
                className="text-gray-500 hover:text-forest-600 p-0 h-auto font-normal"
              >
                <X className="h-4 w-4 mr-1" />
                Очистить все
              </Button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Активные фильтры</h3>
              <div className="flex flex-wrap gap-2">
                {searchValue && (
                  <Badge className="gap-1 bg-forest-100 text-forest-800 hover:bg-forest-200">
                    Поиск: &quot;{searchValue}&quot;
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
          </div>

          {/* Mobile: аккордеон для фильтров */}
          <div className="lg:hidden mt-4">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="filters" className="border-forest-200">
                <AccordionTrigger className="hover:no-underline text-forest-800 hover:text-forest-800 [&:hover]:text-forest-800 font-semibold py-3">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Активные фильтры ({(searchValue ? 1 : 0) + selectedCategories.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={onClearAllFilters}
                        className="text-gray-500 hover:text-forest-600 p-0 h-auto font-normal"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Очистить все
                      </Button>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {searchValue && (
                        <Badge className="gap-1 bg-forest-100 text-forest-800 hover:bg-forest-200">
                          Поиск: &quot;{searchValue}&quot;
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </>
      )}
    </div>
  );
}