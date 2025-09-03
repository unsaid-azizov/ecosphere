import { Navbar } from '@/components/navbar';
import { OrdersClient } from './orders-client';

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <OrdersClient />
      </div>
    </div>
  );
}