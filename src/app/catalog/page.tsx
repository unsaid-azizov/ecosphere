import { Suspense } from 'react';
import { CatalogClient } from './catalog-client';
import { Navbar } from '@/components/navbar';

export default function CatalogPage() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Загрузка...</div>}>
          <CatalogClient />
        </Suspense>
        </div>
      </div>
    </div>
  );
}