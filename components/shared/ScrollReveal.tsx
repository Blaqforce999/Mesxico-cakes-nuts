'use client';

import React, { useRef, useEffect, useState } from 'react';

type ScrollRevealProps = {
  children: React.ReactNode;
  /** Index within a group for staggered entry (0-based). Each adds ~120ms delay. */
  staggerIndex?: number;
  /** Override the base animation duration in ms. Default 650ms. */
  duration?: number;
  className?: string;
};

/**
 * Scroll-triggered reveal wrapper. Children start hidden (opacity 0, translateY 20px)
 * and animate to visible (opacity 1, translateY 0) once they enter the viewport.
 *
 * Triggers ONCE — does not re-animate when scrolling back up.
 * Uses IntersectionObserver with threshold 0.15.
 *
 * Timing: ease-out, 650ms default, stagger delay 120ms per index.
 * No parallax, no elastic, no bounce.
 */
export function ScrollReveal({
  children,
  staggerIndex = 0,
  duration = 650,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, []);

  const staggerDelay = staggerIndex * 120;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity ${duration}ms ease-out ${staggerDelay}ms, transform ${duration}ms ease-out ${staggerDelay}ms`,
      }}
    >
      {children}
    </div>
  );
}
