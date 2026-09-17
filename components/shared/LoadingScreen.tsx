'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Fullscreen loading screen shown before page content appears.
 * Displays the brand logo with a subtle pulse animation and "Loading" text.
 * Fades out after a minimum 1.5s display time and when the window has loaded.
 */
export function LoadingScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let hasMinTimePassed = false;
    let hasPageLoaded = false;

    const tryDismiss = () => {
      if (hasMinTimePassed && hasPageLoaded) {
        setIsFadingOut(true);
        setTimeout(() => setIsVisible(false), 600);
      }
    };

    const minTimer = setTimeout(() => {
      hasMinTimePassed = true;
      tryDismiss();
    }, 1500);

    const handleLoad = () => {
      hasPageLoaded = true;
      tryDismiss();
    };

    if (document.readyState === 'complete') {
      hasPageLoaded = true;
      tryDismiss();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearTimeout(minTimer);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      style={{
        opacity: isFadingOut ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: isFadingOut ? 'none' : 'auto',
      }}
    >
      <div
        className="relative w-36 h-20"
        style={{
          animation: 'loading-pulse 1.8s ease-in-out infinite',
        }}
      >
        <Image
          src="/logo.png"
          alt="Mesxico Cakes and Nuts"
          fill
          className="object-contain"
          priority
        />
      </div>
      <p className="mt-4 text-sm font-body text-on-surface-variant tracking-widest uppercase">
        Loading
      </p>

      <style jsx>{`
        @keyframes loading-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.85; }
        }
      `}</style>
    </div>
  );
}
