import { Navbar } from '@/components/navbar';
import { CartClient } from './cart-client';

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <CartClient />
        </div>
      </div>
    </div>
  );
}