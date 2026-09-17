'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type HeroSlide = {
  src: string;
  alt: string;
};

const HERO_SLIDES: HeroSlide[] = [
  {
    src: '/product_images/cupcakes_decorated.jpeg',
    alt: 'Decorated Gourmet Cupcakes',
  },
  {
    src: '/product_images/groundnut_display.png',
    alt: 'Artisanal Salted Groundnuts',
  },
  {
    src: '/product_images/cupcakes_bulk.jpeg',
    alt: 'Freshly Baked Cupcakes Batch',
  },
  {
    src: '/product_images/peanut_display.png',
    alt: 'Artisanal Packaged Peanuts',
  },
  {
    src: '/product_images/groundnut_bulk.png',
    alt: 'Premium Roasted Groundnuts',
  },
  {
    src: '/product_images/cupcake_pinkcandle.jpeg',
    alt: 'Celebration Birthday Cupcake with Pink Candle',
  },
];

const AUTO_ADVANCE_MS = 2000;

/**
 * Botanical leaf sprig artwork tucked directly beneath the food card.
 * Features enriched opacity for vibrant framing.
 */
function BotanicalLeafSprig({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-28 h-28 sm:w-36 sm:h-36 text-secondary pointer-events-none select-none opacity-65 ${className}`}
      aria-hidden="true"
    >
      {/* Main organic stem originating from beneath the card corner */}
      <path
        d="M20,120 Q50,80 110,20"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.65"
      />
      {/* Side branch left */}
      <path
        d="M48,84 Q25,68 22,46"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />
      {/* Side branch right */}
      <path
        d="M78,54 Q100,68 114,62"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.55"
      />

      {/* Main top leaf blade */}
      <g transform="translate(70, 6) rotate(42)">
        <path
          d="M30,68 Q10,48 15,24 Q18,8 30,0 Q42,8 45,24 Q50,48 30,68Z"
          fill="currentColor"
          opacity="0.8"
        />
        <path d="M30,62 Q30,30 30,5" stroke="currentColor" strokeWidth="1.4" opacity="0.55" />
        <path d="M25,42 Q30,36 30,30" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M35,36 Q30,31 30,24" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M26,26 Q30,22 30,16" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      </g>

      {/* Secondary left leaf blade */}
      <g transform="translate(6, 28) rotate(-28)">
        <path
          d="M24,50 Q8,36 12,18 Q14,6 24,0 Q34,6 36,18 Q40,36 24,50Z"
          fill="currentColor"
          opacity="0.75"
        />
        <path d="M24,45 Q24,24 24,4" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
        <path d="M20,32 Q24,28 24,22" stroke="currentColor" strokeWidth="0.9" opacity="0.35" />
        <path d="M28,27 Q24,23 24,16" stroke="currentColor" strokeWidth="0.9" opacity="0.35" />
      </g>

      {/* Tertiary right leaf blade */}
      <g transform="translate(86, 45) rotate(68)">
        <path
          d="M20,44 Q7,30 10,15 Q12,5 20,0 Q28,5 30,15 Q33,30 20,44Z"
          fill="currentColor"
          opacity="0.7"
        />
        <path d="M20,38 Q20,20 20,3" stroke="currentColor" strokeWidth="1" opacity="0.5" />
      </g>

      {/* Small delicate accent leaf */}
      <g transform="translate(44, 58) rotate(-60)">
        <path
          d="M12,28 Q4,19 6,10 Q7,3 12,0 Q17,3 18,10 Q20,19 12,28Z"
          fill="currentColor"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

/**
 * Full-width hero image carousel with chevron navigation.
 * The active image is displayed with a scale/fade transition.
 *
 * All slide containers share an identical aspect-square rounded frame
 * with uniform styling and dimensions.
 *
 * Auto-advances every 3.5s, pauses on hover. Touch-swipe friendly.
 */
export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      const total = HERO_SLIDES.length;
      setCurrentSlide(((index % total) + total) % total);
    },
    []
  );

  const goNext = useCallback(() => goToSlide(currentSlide + 1), [currentSlide, goToSlide]);
  const goPrev = useCallback(() => goToSlide(currentSlide - 1), [currentSlide, goToSlide]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(goNext, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  // Touch swipe support
  const touchStartX = React.useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goNext();
      else goPrev();
    }
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Carousel Viewport: Uniform aspect-square container */}
      <div className="relative mx-auto w-full max-w-[420px] sm:max-w-lg aspect-square flex items-center justify-center">
        {/* Top-Right Decorative Herb Sprig tucked beneath card */}
        <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 pointer-events-none select-none z-0">
          <BotanicalLeafSprig />
        </div>

        {/* Bottom-Left Decorative Herb Sprig tucked beneath card (exact duplicate, rotated 180deg) */}
        <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 pointer-events-none select-none z-0 transform rotate-180">
          <BotanicalLeafSprig />
        </div>

        {HERO_SLIDES.map((slide, index) => (
          <div
            key={slide.src}
            className="absolute inset-0 p-2 sm:p-4 flex items-center justify-center transition-all duration-700 ease-out z-10"
            style={{
              opacity: index === currentSlide ? 1 : 0,
              transform: index === currentSlide ? 'scale(1)' : 'scale(0.95)',
              pointerEvents: index === currentSlide ? 'auto' : 'none',
            }}
          >
            {/* Same size uniform container for every slide */}
            <div
              style={{ backgroundColor: 'var(--color-surface-variant)' }}
              className="relative w-full h-full rounded-3xl overflow-hidden border border-outline-variant/60 shadow-2xl flex items-center justify-center"
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(max-width: 768px) 90vw, 500px"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Left Chevron */}
      <button
        type="button"
        onClick={goPrev}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>

      {/* Right Chevron */}
      <button
        type="button"
        onClick={goNext}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-all active:scale-95 shadow-md"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
      </button>

    </div>
  );
}
