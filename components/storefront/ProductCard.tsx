'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Product } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import { useCartStore } from '@/lib/cart/cart-store';
import { useModalStore } from '@/lib/modal-store';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const openProductModal = useModalStore((state) => state.openProductModal);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openProductModal(product);
  };

  const primaryImage = product.images[0] || '/product_images/cupcake_single.jpeg';

  return (
    <div
      onClick={handleCardClick}
      className="group flex flex-col bg-surface rounded-3xl border border-outline-variant/60 overflow-hidden artisan-card-shadow transition-all duration-300 hover:-translate-y-1 cursor-pointer"
    >
      {/* Product Image Frame: Edge-to-edge balanced container scaled to fit the card */}
      <div className="relative aspect-square w-full overflow-hidden bg-surface-variant/40 block border-b border-outline-variant/30">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />
      </div>

      {/* Product Info */}
      <div className="p-5 flex flex-col flex-grow justify-between space-y-4">
        <div>
          <div className="block">
            <h3 className="font-display font-semibold text-lg text-on-surface group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
          </div>
          <p className="mt-1.5 text-xs text-on-surface-variant line-clamp-2 font-body leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-outline-variant/40 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-outline font-body block leading-none">Price</span>
            <span className="font-display font-bold text-xl text-primary mt-0.5 block">
              {formatNaira(product.price_kobo)}
            </span>
          </div>

          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center space-x-1.5 bg-primary text-on-primary hover:opacity-90 active:scale-95 px-3.5 py-2 rounded-full text-xs font-semibold font-body min-h-[44px] transition-all"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}
