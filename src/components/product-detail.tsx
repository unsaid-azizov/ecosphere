'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Share2, Heart, Check, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Lens } from '@/components/magicui/lens';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { useCart } from '@/contexts/cart-context';

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  const { addToCart, isInCart, getItemQuantity, updateQuantity } = useCart();
  const inCart = isInCart(product.id);
  const cartQuantity = getItemQuantity(product.id);
  
  // Debug: log product images
  console.log('Product images:', product.images);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link 
          href="/catalog"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Вернуться к каталогу
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden shadow-lg">
            
            {/* Carousel container with slide animation */}
            <div className="w-full h-full p-8">
              <div className="relative w-full h-full overflow-hidden">
                <div 
                  className="flex transition-transform duration-700 ease-in-out h-full"
                  style={{ 
                    transform: `translateX(-${currentImageIndex * (100 / product.images.length)}%)`,
                    width: `${product.images.length * 100}%`
                  }}
                >
                  {product.images.map((image, index) => (
                    <div key={index} className="relative flex-shrink-0 flex items-center justify-center" style={{ width: `${100 / product.images.length}%`, height: '100%' }}>
                      <div className="relative w-full h-full">
                        <Image
                          src={image || '/placeholder-image.svg'}
                          alt={`${product.name} ${index + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain hover:scale-105 transition-transform duration-300"
                          priority={index === 0}
                          onError={(e) => {
                            console.log('Image error:', e);
                            (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                          }}
                          onLoad={() => {
                            console.log('Image loaded:', image);
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    prevImage();
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    nextImage();
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </>
            )}

            {/* Article badge */}
            <Badge 
              variant="secondary" 
              className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-gray-700 z-20 shadow-sm border border-gray-200"
            >
              {product.article}
            </Badge>
          </div>

          {/* Thumbnail gallery */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 bg-white rounded-lg overflow-hidden border-2 transition-all duration-200",
                    index === currentImageIndex 
                      ? "border-gray-900 shadow-md" 
                      : "border-gray-200 hover:border-gray-400"
                  )}
                >
                  <div className="relative w-full h-full p-2">
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <Badge variant="outline" className="mb-4 text-sm">
              {product.category.length > 25 ? `${product.category.substring(0, 25)}...` : product.category}
            </Badge>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">{product.name}</h1>
            <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              ₽{product.price.toLocaleString()}
            </div>
          </div>

          {/* Quantity and Add to Cart - moved to top */}
          <div className="space-y-4 p-6 bg-gray-50 rounded-xl border">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-gray-900">Количество:</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg font-medium"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = Math.max(1, parseInt(e.target.value) || 1);
                      setQuantity(value);
                    }}
                    className="w-20 h-8 text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center text-lg font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Quick quantity buttons */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 mr-2">Быстрый выбор:</span>
                {[5, 25, 100].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => setQuantity(qty)}
                    className={`px-3 py-1 text-sm rounded-lg border transition-colors ${
                      quantity === qty 
                        ? 'bg-gray-900 text-white border-gray-900' 
                        : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {qty}
                  </button>
                ))}
              </div>

              {/* Total price calculation */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Итого:</span>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      ₽{(product.price * quantity).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                      {quantity} × ₽{product.price.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  size="lg" 
                  disabled={isAddingToCart}
                  className={cn(
                    "sm:flex-1 h-12 text-base font-semibold transition-all duration-200",
                    inCart 
                      ? "bg-green-600 hover:bg-green-700 text-white" 
                      : "bg-gray-900 hover:bg-gray-800 text-white"
                  )}
                  onClick={async () => {
                    if (!isAddingToCart) {
                      setIsAddingToCart(true);
                      
                      if (inCart) {
                        // If already in cart, update quantity
                        updateQuantity(product.id, cartQuantity + quantity);
                      } else {
                        // Add to cart with selected quantity
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: product.price,
                          images: product.images,
                          article: product.article,
                          category: product.category
                        }, quantity);
                      }
                      
                      // Show feedback animation
                      setTimeout(() => {
                        setIsAddingToCart(false);
                      }, 500);
                    }
                  }}
                >
                  {isAddingToCart ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  ) : inCart ? (
                    <Check className="w-5 h-5 mr-2" />
                  ) : (
                    <ShoppingCart className="w-5 h-5 mr-2" />
                  )}
                  {inCart ? `Обновить корзину (${cartQuantity})` : 'Добавить в корзину'}
                </Button>
                <div className="flex gap-3 sm:gap-2">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 sm:flex-none h-12 sm:px-4"
                    title="Добавить в избранное"
                  >
                    <Heart className="w-5 h-5 sm:mr-0 mr-2" />
                    <span className="sm:hidden">Избранное</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="flex-1 sm:flex-none h-12 sm:px-4"
                    title="Поделиться"
                  >
                    <Share2 className="w-5 h-5 sm:mr-0 mr-2" />
                    <span className="sm:hidden">Поделиться</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-3">Описание товара</h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg mb-4">Характеристики</h3>
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Артикул</span>
                  <span className="font-medium">{product.article}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-600">Категория</span>
                  <span className="font-medium text-right max-w-[60%] break-words">
                    {product.category.length > 35 
                      ? `${product.category.substring(0, 35)}...` 
                      : product.category
                    }
                  </span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Цена</span>
                  <span className="font-medium">₽{product.price.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}