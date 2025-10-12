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
      <div className="w-full mb-8 hidden md:block">
        <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-lg shadow-lg bg-gray-200 animate-pulse" />
      </div>
    );
  }

  if (bannerImages.length === 0) {
    return null;
  }

  return (
    <div className="w-full mb-8 hidden md:block relative">
      {/* Decorative gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-lime-50 via-sage-50 to-lime-50 rounded-2xl -z-10 blur-2xl opacity-50" />

      <div className="relative p-2 bg-white/40 backdrop-blur-sm rounded-2xl shadow-2xl border-2 border-lime-200/50">
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
                <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden rounded-xl shadow-xl ring-2 ring-lime-300/30">
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
          <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-forest-800 backdrop-blur-sm border-2 border-lime-300 h-12 w-12 shadow-lg hover:shadow-xl hover:scale-110 transition-all" />
          <CarouselNext className="right-4 bg-white/90 hover:bg-white text-forest-800 backdrop-blur-sm border-2 border-lime-300 h-12 w-12 shadow-lg hover:shadow-xl hover:scale-110 transition-all" />
        </Carousel>
      </div>
    </div>
  );
}