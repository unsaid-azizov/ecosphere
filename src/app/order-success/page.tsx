import { Navbar } from '@/components/navbar';
import { OrderSuccessClient } from './order-success-client';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <OrderSuccessClient />
      </div>
    </div>
  );
}