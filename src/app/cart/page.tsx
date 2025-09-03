import { Navbar } from '@/components/navbar';
import { CartClient } from './cart-client';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <CartClient />
      </div>
    </div>
  );
}