'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

export function FloatingActions() {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 350) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <>
      {/* Back to Top Button: Far right, compact size, pointed keyboard chevron arrow */}
      {showBackToTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-20 right-2.5 sm:bottom-22 sm:right-3.5 z-40 bg-primary text-on-primary hover:opacity-90 shadow-md rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          aria-label="Back to top"
          title="Back to top"
        >
          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
        </button>
      )}

      {/* Floating WhatsApp Logo: Bottom-Right, scaled down, gentle continuous bobbing */}
      <a
        href="https://wa.me/2347030420150?text=Hello%20Mesxico%20Cakes%20%26%20Nuts!%20I%20would%20like%20to%20inquire%20about%20an%20order."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-4 sm:bottom-8 sm:right-6 z-40 inline-block animate-whatsapp-bob transition-transform duration-200 hover:scale-110 active:scale-95 drop-shadow-md focus:outline-none"
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
      >
        <svg
          viewBox="0 0 48 48"
          className="w-10 h-10 sm:w-11 sm:h-11"
          aria-hidden="true"
        >
          <path
            fill="#25D366"
            d="M24 4C12.95 4 4 12.95 4 24c0 3.82 1.07 7.39 2.92 10.45L4 44l9.84-2.87C16.81 42.94 20.29 44 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4z"
          />
          <path
            fill="#FFF"
            d="M34.72 29.54c-.5-.25-2.95-1.45-3.41-1.62-.46-.17-.79-.25-1.12.25-.33.5-1.29 1.62-1.58 1.95-.29.33-.58.37-1.08.12-.5-.25-2.11-.78-4.02-2.48-1.49-1.33-2.5-2.97-2.79-3.47-.29-.5-.03-.77.22-1.02.22-.22.5-.58.75-.87.25-.29.33-.5.5-.83.17-.33.08-.62-.04-.87-.12-.25-1.12-2.71-1.54-3.71-.41-.97-.83-.84-1.14-.85l-.97-.02c-.33 0-.87.12-1.33.62s-1.75 1.71-1.75 4.17 1.79 4.83 2.04 5.17c.25.33 3.52 5.37 8.52 7.53 1.19.51 2.12.82 2.84 1.05 1.2.38 2.29.33 3.15.2 1.03-.15 2.95-1.21 3.37-2.38.42-1.17.42-2.17.29-2.38-.12-.21-.45-.33-.95-.58z"
          />
        </svg>
      </a>
    </>
  );
}
