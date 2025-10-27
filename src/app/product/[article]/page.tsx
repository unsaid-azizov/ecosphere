import { notFound, redirect } from 'next/navigation';
import { ProductDetail } from '@/components/product-detail';
import { Navbar } from '@/components/navbar';
import { prisma } from '@/lib/prisma';
import { Product } from '@/types/product';

interface ProductPageProps {
  params: {
    article: string;
  };
}

async function getProduct(article: string): Promise<Product | null> {
  try {
    const product = await prisma.product.findFirst({
      where: { article }
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
    // Декодируем артикул из URL (для кириллицы и спецсимволов)
    const decodedArticle = decodeURIComponent(params.article);
    const product = await getProduct(decodedArticle);

    if (!product) {
      console.log(`Product not found: ${decodedArticle} (original: ${params.article})`);
      // Instead of showing 404, redirect to catalog
      redirect('/catalog');
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-lime-50/80 to-sage-100/60 relative">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <ProductDetail product={product} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error loading product ${decodeURIComponent(params.article)}:`, error);
    notFound();
  }
}