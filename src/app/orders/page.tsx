import { Navbar } from '@/components/navbar';
import { OrdersClient } from './orders-client';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <OrdersClient />
        </div>
      </div>
    </div>
  );
}