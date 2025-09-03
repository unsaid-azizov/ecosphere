import { Navbar } from '@/components/navbar';
import { CheckoutClient } from './checkout-client';

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <CheckoutClient />
      </div>
    </div>
  );
}