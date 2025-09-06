import { Suspense } from 'react';
import { CatalogClient } from './catalog-client';
import { Navbar } from '@/components/navbar';

export default function CatalogPage() {

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Органичный эффект кистью художника - неровные края */}
      <div 
        className="absolute top-0 left-0 w-full h-screen opacity-90 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 350px 280px at 5% 12%, rgba(16, 185, 129, 0.35) 0%, rgba(16, 185, 129, 0.18) 40%, transparent 75%),
            radial-gradient(ellipse 420px 310px at 95% 8%, rgba(14, 165, 233, 0.32) 0%, rgba(14, 165, 233, 0.15) 35%, transparent 70%),
            radial-gradient(ellipse 280px 400px at 2% 25%, rgba(34, 197, 94, 0.28) 0%, rgba(34, 197, 94, 0.12) 30%, transparent 65%),
            radial-gradient(ellipse 380px 290px at 98% 18%, rgba(6, 182, 212, 0.30) 0%, rgba(6, 182, 212, 0.14) 38%, transparent 72%),
            radial-gradient(ellipse 220px 350px at 8% 40%, rgba(52, 211, 153, 0.22) 0%, transparent 60%),
            radial-gradient(ellipse 300px 250px at 92% 32%, rgba(14, 116, 144, 0.25) 0%, transparent 55%),
            radial-gradient(ellipse 180px 480px at 1% 55%, rgba(16, 185, 129, 0.20) 0%, transparent 50%),
            radial-gradient(ellipse 250px 380px at 99% 45%, rgba(14, 165, 233, 0.23) 0%, transparent 58%)
          `,
          clipPath: `polygon(
            0% 0%, 
            8% 2%, 
            15% 0%, 
            22% 3%, 
            28% 1%, 
            35% 4%, 
            42% 2%, 
            48% 5%, 
            55% 3%, 
            62% 6%, 
            68% 4%, 
            75% 7%, 
            82% 5%, 
            88% 8%, 
            95% 6%, 
            100% 0%, 
            100% 45%, 
            98% 52%, 
            100% 58%, 
            97% 65%, 
            100% 70%, 
            95% 78%, 
            100% 85%, 
            92% 92%, 
            100% 100%, 
            0% 100%, 
            2% 95%, 
            0% 88%, 
            3% 82%, 
            0% 75%, 
            4% 68%, 
            0% 60%, 
            2% 52%, 
            0% 45%
          )`,
          filter: 'blur(1.5px) contrast(1.15) saturate(1.1)',
          mixBlendMode: 'multiply'
        }}
      />
      
      {/* Дополнительные "брызги" краски */}
      <div 
        className="absolute top-0 left-0 w-full h-[80vh] opacity-70 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 120px 180px at 3% 15%, rgba(16, 185, 129, 0.45) 0%, rgba(16, 185, 129, 0.25) 30%, transparent 65%),
            radial-gradient(ellipse 140px 200px at 97% 12%, rgba(14, 165, 233, 0.40) 0%, rgba(14, 165, 233, 0.22) 35%, transparent 70%),
            radial-gradient(ellipse 100px 160px at 1% 35%, rgba(34, 197, 94, 0.38) 0%, transparent 55%),
            radial-gradient(ellipse 130px 190px at 99% 28%, rgba(6, 182, 212, 0.35) 0%, transparent 60%),
            radial-gradient(ellipse 80px 120px at 6% 8%, rgba(52, 211, 153, 0.30) 0%, transparent 50%),
            radial-gradient(ellipse 110px 140px at 94% 5%, rgba(14, 116, 144, 0.33) 0%, transparent 55%),
            radial-gradient(ellipse 70px 200px at 2% 60%, rgba(16, 185, 129, 0.28) 0%, transparent 45%),
            radial-gradient(ellipse 90px 170px at 98% 55%, rgba(14, 165, 233, 0.32) 0%, transparent 50%)
          `,
          clipPath: `polygon(
            0% 0%, 
            12% 1%, 
            18% 0%, 
            25% 2%, 
            32% 0%, 
            38% 3%, 
            45% 1%, 
            52% 4%, 
            58% 2%, 
            65% 5%, 
            72% 3%, 
            78% 6%, 
            85% 4%, 
            92% 7%, 
            100% 5%, 
            100% 25%, 
            95% 32%, 
            100% 38%, 
            93% 45%, 
            100% 52%, 
            0% 52%, 
            7% 45%, 
            0% 38%, 
            5% 32%, 
            0% 25%
          )`,
          filter: 'blur(0.8px) contrast(1.2)',
          mixBlendMode: 'soft-light'
        }}
      />
      <div className="relative z-10">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
        <Suspense fallback={<div>Загрузка...</div>}>
          <CatalogClient />
        </Suspense>
        </div>
      </div>
    </div>
  );
}