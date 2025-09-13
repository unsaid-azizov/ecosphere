import { Navbar } from '@/components/navbar';
import { CatalogClient } from './catalog/catalog-client';
import { type ServerDiscountResult } from '@/lib/server-discounts';

export default function HomePage() {
  // Empty discounts array - discounts will be loaded client-side by CatalogClient
  const discounts: ServerDiscountResult[] = [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CatalogClient discounts={discounts} />
        </div>
      </div>
    </div>
  );
}