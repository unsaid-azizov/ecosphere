'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lens } from '@/components/magicui/lens';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';
import { ProductPrice } from '@/components/product-price';
import { FavoriteButton } from '@/components/favorite-button';
import { DiscountBadge } from '@/components/discount-badge';
import { AddToCartButton } from '@/components/add-to-cart-button';

interface ProductCardProps {
  product: Product;
  index?: number; // Добавляем индекс для приоритета загрузки
  discountPercent?: number; // Процент скидки для отображения
  discountName?: string; // Название скидки
}

export function ProductCard({
  product,
  index = 0,
  discountPercent = 0,
  discountName
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Первые 6 карточек загружаются с высоким приоритетом
  const isHighPriority = index < 6;

  const router = useRouter();

  // Обработчик клика по карточке для навигации
  const handleCardClick = (e: React.MouseEvent) => {
    // Не навигируем если клик был на интерактивном элементе
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('.image-nav-button')
    ) {
      return;
    }

    router.push(`/product/${product.article}`);
  };

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
      className="group overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-lime-300 transition-all duration-200 w-full flex flex-col h-full cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      <CardContent className="p-0 flex flex-col h-full">
          <div className="relative w-full h-48 sm:h-60 lg:h-72 overflow-hidden bg-gray-50">
            <Lens zoomFactor={1.5} lensSize={120}>
              <div
                className="relative w-full h-48 sm:h-60 lg:h-72"
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
                  {product.images.map((image, imgIndex) => (
                    <div
                      key={imgIndex}
                      className="relative flex-shrink-0 w-full h-48 sm:h-60 lg:h-72"
                      style={{ width: `${100 / product.images.length}%` }}
                    >
                      {/* Загружаем только видимое изображение + соседние для плавности */}
                      {(imgIndex === currentImageIndex || 
                        imgIndex === currentImageIndex - 1 || 
                        imgIndex === currentImageIndex + 1 ||
                        (currentImageIndex === 0 && imgIndex === product.images.length - 1) ||
                        (currentImageIndex === product.images.length - 1 && imgIndex === 0)) && (
                        <Image
                          src={image || '/placeholder-image.svg'}
                          alt={`${product.name} - изображение ${imgIndex + 1}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-contain transition-all duration-400 ease-in-out"
                          priority={isHighPriority && imgIndex === 0} // Высокий приоритет только для первого изображения первых карточек
                          loading={isHighPriority ? 'eager' : 'lazy'}
                          placeholder="blur"
                          blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-image.svg';
                          }}
                        />
                      )}
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
                    "image-nav-button absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110",
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
                    "image-nav-button absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-lg flex items-center justify-center transition-all duration-300 z-30 border border-gray-200 hover:bg-white hover:scale-110",
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
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/95 backdrop-blur-sm text-gray-700 z-20 shadow-sm border border-gray-200 text-xs"
            >
              {product.article}
            </Badge>
            
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20">
              <FavoriteButton 
                productId={product.id} 
                size="sm"
                className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-sm"
              />
            </div>
          </div>

          <div className="p-3 sm:p-4 flex flex-col flex-1">
            {/* Цена в верхнем левом углу */}
            <div className="mb-2">
              <ProductPrice 
                productId={product.id}
                originalPrice={product.price}
                className="text-lg sm:text-xl"
                showSavings={false}
              />
            </div>

            {/* Название товара */}
            <div className="min-h-[2.5rem] mb-1 flex items-start">
              <h3 className="font-medium text-gray-900 line-clamp-2 leading-5 text-sm hover:text-forest-600 transition-colors duration-200">
                {product.name}
              </h3>
            </div>

            {/* Описание - только на больших экранах */}
            <div className="min-h-[1.25rem] mb-2">
              <p className="text-xs text-gray-600 line-clamp-1 hidden sm:block">
                {product.description}
              </p>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4 min-h-[1.5rem]">
              {discountPercent > 0 && (
                <DiscountBadge 
                  discountPercent={discountPercent}
                  discountName={discountName}
                  className="text-xs"
                />
              )}
              <Badge variant="outline" className="text-xs w-fit max-w-full truncate border-forest-300 text-forest-600">
                {product.category.length > 20 ? `${product.category.substring(0, 20)}...` : product.category}
              </Badge>
            </div>

            {/* Заполнитель для выравнивания кнопки вниз */}
            <div className="flex-grow"></div>

            {/* Кнопка на всю ширину внизу */}
            <AddToCartButton
              product={product}
              quantity={1}
              fullWidth
              className="rounded-xl py-3 text-sm font-bold mt-auto"
            />
          </div>
        </CardContent>
    </Card>
  );
}