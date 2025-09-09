'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

const banners = [
  {
    id: 1,
    image: '/banner.png',
    title: '-50% скидки на бумажную продукцию',
    description: 'Специальное предложение на все виды бумажной продукции'
  },
  {
    id: 2,
    image: '/banner.png',
    title: 'Эко товары для отелей',
    description: 'Широкий выбор экологичных решений для гостиничного бизнеса'
  },
  {
    id: 3,
    image: '/banner.png', 
    title: 'Быстрая доставка по всей России',
    description: 'Доставляем товары в кратчайшие сроки'
  }
];

export function BannerCarousel() {
  return (
    <div className="w-full mb-8">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 4000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {banners.map((banner, index) => (
            <CarouselItem key={banner.id}>
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                
                {/* Content overlay */}
                <div className="absolute inset-0 flex items-center">
                  <div className="px-6 sm:px-8 lg:px-12 max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                      {banner.title}
                    </h2>
                    <p className="text-lg sm:text-xl text-lime-100 mb-6">
                      {banner.description}
                    </p>
                    <Button 
                      size="lg" 
                      className="bg-lime-400 hover:bg-lime-500 text-forest-800 font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Узнать больше
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 h-12 w-12" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm border-0 h-12 w-12" />
      </Carousel>
    </div>
  );
}