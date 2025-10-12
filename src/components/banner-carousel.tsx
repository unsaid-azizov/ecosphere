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
          // Fallback to default banner if no images found
          setBannerImages(images.length > 0 ? images : ['/banner.png']);
        } else {
          setBannerImages(['/banner.png']);
        }
      } catch (error) {
        console.error('Failed to load banners:', error);
        setBannerImages(['/banner.png']);
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
          {bannerImages.map((image, index) => (
            <CarouselItem key={index}>
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
        <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
        <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm border-0 h-12 w-12 opacity-60 hover:opacity-80" />
      </Carousel>
    </div>
  );
}