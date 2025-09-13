'use client';

import { Globe } from '@/components/magicui/globe';
import { motion } from 'framer-motion';

const ECO_GLOBE_CONFIG = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.5,
  baseColor: [0.1, 0.2, 0.05] as [number, number, number], // Dark forest green base
  markerColor: [163 / 255, 230 / 255, 53 / 255] as [number, number, number], // Lime green markers
  glowColor: [163 / 255, 230 / 255, 53 / 255] as [number, number, number], // Lime green glow
  markers: [
    // Major ecological regions and our company presence
    { location: [55.7558, 37.6173] as [number, number], size: 0.08 }, // Moscow (headquarters)
    { location: [59.9311, 30.3609] as [number, number], size: 0.06 }, // St. Petersburg 
    { location: [56.8431, 60.6454] as [number, number], size: 0.04 }, // Yekaterinburg
    { location: [55.0084, 82.9357] as [number, number], size: 0.04 }, // Novosibirsk
    { location: [43.2220, 76.8512] as [number, number], size: 0.03 }, // Almaty
    { location: [41.2995, 69.2401] as [number, number], size: 0.03 }, // Tashkent
  ],
};

export function EcoSphere({
  className
}: {
  className?: string;
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`relative ${className}`}
    >
      {/* Outer magical glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(163, 230, 53, 0.2), rgba(163, 230, 53, 0.05), transparent)',
          filter: 'blur(40px)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      {/* Rotating energy ring */}
      <motion.div
        className="absolute inset-8 rounded-full border-2"
        style={{
          borderColor: 'rgba(163, 230, 53, 0.6)',
          boxShadow: '0 0 30px rgba(163, 230, 53, 0.4), inset 0 0 20px rgba(163, 230, 53, 0.2)'
        }}
        animate={{
          rotate: 360,
          opacity: [0.4, 0.8, 0.4]
        }}
        transition={{
          rotate: {
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          },
          opacity: {
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
          }
        }}
      />
      
      {/* Globe container with enhanced magical effects */}
      <div className="relative w-full h-full">
        <Globe 
          config={ECO_GLOBE_CONFIG}
          className="drop-shadow-2xl"
        />
        
        {/* Magical particle overlay */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-lime-300 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                boxShadow: '0 0 8px rgba(163, 230, 53, 0.8)'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0, 1, 0],
                scale: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Inner magical aura */}
      <motion.div
        className="absolute inset-12 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(163, 230, 53, 0.1), transparent)',
          filter: 'blur(20px)'
        }}
        animate={{
          scale: [0.9, 1.1, 0.9],
          rotate: [-5, 5, -5]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
}