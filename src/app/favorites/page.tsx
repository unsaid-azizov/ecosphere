import { Suspense } from 'react';
import { FavoritesClient } from './favorites-client';
import { Navbar } from '@/components/navbar';

export default function FavoritesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-lime-400"></div>
                <p className="mt-4 text-gray-600">Загрузка избранных товаров...</p>
              </div>
            </div>
          }>
            <FavoritesClient />
          </Suspense>
        </div>
      </div>
    </div>
  );
}