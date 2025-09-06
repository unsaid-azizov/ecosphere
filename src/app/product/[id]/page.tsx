import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { Navbar } from '@/components/navbar';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: {
    id: string;
  };
}

async function getProduct(id: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { id }
    });

    if (!product) return null;

    return {
      id: product.id,
      article: product.article,
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      images: product.images,
      availability: product.stockQuantity > 0 ? 'В наличии' : 'Нет в наличии',
      stockQuantity: product.stockQuantity,
      isAvailable: product.isAvailable
    };
  } catch (error) {
    console.error('Ошибка получения товара:', error);
    return null;
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const product = await getProduct(params.id);

    if (!product) {
      console.log(`Product not found: ${params.id}`);
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
  } catch (error) {
    console.error(`Error loading product ${params.id}:`, error);
    notFound();
  }
}