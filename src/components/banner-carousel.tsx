'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay";

export function BannerCarousel() {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBanners() {
      try {
        const response = await fetch('/api/banners');
        if (response.ok) {
          const images = await response.json();
          setBannerImages(images);
        }
      } catch (error) {
        console.error('Failed to load banners:', error);
      } finally {
        setLoading(false);
      }
    }

    loadBanners();
  }, []);

  if (loading) {
    return (
      <div className="w-full mb-8">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (bannerImages.length === 0) {
    return null;
  }

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
          dragFree: true,
        }}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {bannerImages.map((image, index) => (
            <CarouselItem key={index} className="pl-2 md:pl-4">
              <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg">
                <Image
                  src={image}
                  alt={`Banner ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex left-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
        <CarouselNext className="hidden md:flex right-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
      </Carousel>
    </div>
  );
}