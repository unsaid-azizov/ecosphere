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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
        <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
      </Carousel>
    </div>
  );
}