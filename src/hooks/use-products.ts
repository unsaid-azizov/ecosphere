'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Product } from '@/types/product';

// Простой кэш для товаров
let productsCache: Product[] | null = null;

interface FilterState {
  search: string;
  categories: string[];
  priceRange: [number, number];
  selectedFilters: string[];
}

interface UseProductsOptions {
  initialProducts?: Product[];
}

export function useProducts({ initialProducts = [] }: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Загрузка товаров из API
  useEffect(() => {
    async function fetchProducts() {
      // Если есть начальные товары, используем их
      if (initialProducts.length > 0) {
        setProducts(initialProducts);
        setLoading(false);
        setHasFetched(true);
        return;
      }

      // Если есть кэш, используем его
      if (productsCache) {
        setProducts(productsCache);
        setLoading(false);
        setHasFetched(true);
        return;
      }

      // Если уже загружали, не загружаем повторно
      if (hasFetched) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/products', {
          // Добавляем кэширование
          headers: {
            'Cache-Control': 'public, max-age=300' // Кэш на 5 минут
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }
        
        const data = await response.json();
        setProducts(data);
        productsCache = data; // Сохраняем в кэш
        setHasFetched(true);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []); // Убираем зависимости, чтобы эффект запускался только один раз
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
    priceRange,
    loading,
    error
  };
}