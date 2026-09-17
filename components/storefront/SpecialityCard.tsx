'use client';

import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/database';
import { useModalStore } from '@/lib/modal-store';

type SpecialityCardProps = {
  product: Product;
  name: string;
  priceDisplay: string;
  image: string;
  imageWrapperClassName?: string;
};

export function SpecialityCard({
  product,
  name,
  priceDisplay,
  image,
  imageWrapperClassName,
}: SpecialityCardProps) {
  const openProductModal = useModalStore((state) => state.openProductModal);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openProductModal(product);
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col items-center text-center w-32 sm:w-36 cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openProductModal(product);
        }
      }}
      aria-label={`View details for ${name}`}
    >
      <div
        style={{ backgroundColor: 'var(--color-surface-variant)' }}
        className="relative w-32 h-32 sm:w-36 sm:h-36 aspect-square mx-auto rounded-full overflow-hidden shadow-md group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border-2 border-outline-variant/40"
      >
        <div className={`relative w-full h-full ${imageWrapperClassName || ''}`}>
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 128px, 144px"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
      </div>
      <h3 className="font-body font-semibold text-xs sm:text-sm text-on-surface mt-3 group-hover:text-primary transition-colors w-[150px] min-h-[2.5rem] flex items-center justify-center">
        {name}
      </h3>
      <span className="font-body font-bold text-primary text-xs sm:text-sm mt-0.5">
        {priceDisplay}
      </span>
    </div>
  );
}
