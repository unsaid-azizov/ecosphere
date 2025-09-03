'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lens } from '@/components/magicui/lens';
import { ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Обработчики переключения изображений
  const nextImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
    setTimeout(() => setIsAnimating(false), 400);
  };

  const prevImage = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
    setTimeout(() => setIsAnimating(false), 400);
  };

  // Обертка для предотвращения перехода по ссылке при клике на кнопки
  const handleImageNavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  return (
    <Card
      className="group overflow-hidden border bg-white shadow-sm hover:shadow-lg transition-all duration-300 w-full max-w-sm cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product/${product.id}`} tabIndex={-1} className="block focus:outline-none">
        <CardContent className="p-0">
          <div className="relative w-full h-64 overflow-hidden bg-gray-50">
            <Lens zoomFactor={1.5} lensSize={120}>
              <div
                className="relative w-full h-64"
                style={{
                  // Для плавной анимации используем translateX
                  overflow: 'hidden',
                }}
              >
                <div
                  className="flex h-full transition-transform duration-400 ease-in-out"
                  style={{
                    width: `${product.images.length * 100}%`,
                    transform: `translateX(-${currentImageIndex * (100 / product.images.length)}%)`,
                  }}
                >
                  {product.images.map((image, index) => (
                    <div
                      key={index}
                      className="relative flex-shrink-0 w-full h-64"
                      style={{ width: `${100 / product.images.length}%` }}
                    >
                      <Image
                        src={image || '/placeholder-image.svg'}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-contain transition-all duration-400 ease-in-out"
                        priority={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Lens>

            {product.images.length > 1 && (
              <>
                <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                {/* Кнопка влево */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    handleImageNavClick(e);
                    prevImage();
                  }}
                  className={cn(
                    "absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-80 -translate-x-1"
                  )}
                >
                  <ChevronLeft className="w-4 h-4 text-gray-700" />
                </button>
                {/* Кнопка вправо */}
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={(e) => {
                    handleImageNavClick(e);
                    nextImage();
                  }}
                  className={cn(
                    "absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110",
                    isHovered ? "opacity-100 translate-x-0" : "opacity-80 translate-x-1"
                  )}
                >
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                </button>
                {/* Индикаторы */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 z-30">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      tabIndex={-1}
                      onClick={(e) => {
                        handleImageNavClick(e);
                        setCurrentImageIndex(index);
                      }}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all duration-200 border border-white/20",
                        index === currentImageIndex
                          ? "bg-white shadow-md scale-110"
                          : "bg-white/70 hover:bg-white/90 hover:scale-105"
                      )}
                    />
                  ))}
                </div>
              </>
            )}

            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-gray-700 z-20 shadow-sm border border-gray-200"
            >
              {product.article}
            </Badge>
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-1">
              <h3 className="font-medium text-gray-900 line-clamp-2 leading-5 text-sm">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-1">
                {product.description}
              </p>
            </div>

            <div className="space-y-2">
              <Badge variant="outline" className="text-xs w-fit max-w-full truncate">
                {product.category.length > 20 ? `${product.category.substring(0, 20)}...` : product.category}
              </Badge>

              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold text-gray-900">
                  ₽{product.price}
                </div>

                <Button
                  size="sm"
                  className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-3 py-1 text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    // TODO: Add to cart logic
                    console.log('Added to cart:', product.name);
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  В корзину
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}