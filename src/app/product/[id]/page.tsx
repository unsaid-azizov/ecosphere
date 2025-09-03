import { notFound } from 'next/navigation';
import { getProducts } from '@/lib/data';
import { ProductDetail } from '@/components/product-detail';
import { Navbar } from '@/components/navbar';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const products = await getProducts();
  const product = products.find(p => p.id === params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const products = await getProducts();
  
  return products.map((product) => ({
    id: product.id,
  }));
}