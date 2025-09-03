'use client';

import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';

interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  selectedFilters: string[];
}

interface UseProductsOptions {
  initialProducts: Product[];
}

export function useProducts({ initialProducts }: UseProductsOptions) {
  const [products] = useState<Product[]>(initialProducts);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    priceRange: [0, 1000],
    selectedFilters: []
  });

  const categories = useMemo(() => {
    const categorySet = new Set(products.map(p => p.category).filter(Boolean));
    return Array.from(categorySet).sort();
  }, [products]);

  const priceRange = useMemo(() => {
    const prices = products.map(p => p.price).filter(p => p > 0);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 1000)
    };
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = !filters.search || 
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.article.toLowerCase().includes(filters.search.toLowerCase());

      const matchesCategory = filters.categories.length === 0 || 
        filters.categories.includes(product.category);

      const matchesPrice = product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, filters]);

  useEffect(() => {
    if (priceRange.min !== undefined && priceRange.max !== undefined) {
      setFilters(prev => ({
        ...prev,
        priceRange: [priceRange.min, priceRange.max]
      }));
    }
  }, [priceRange]);

  return {
    products,
    filteredProducts,
    filters,
    setFilters,
    categories,
    priceRange
  };
}