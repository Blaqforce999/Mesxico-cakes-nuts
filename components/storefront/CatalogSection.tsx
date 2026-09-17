'use client';

import React, { useState } from 'react';
import { Cake, Nut, Package } from 'lucide-react';
import { Product } from '@/types/database';
import { ProductCard } from '@/components/storefront/ProductCard';

type FilterTag = 'all' | 'cupcakes' | 'nuts' | 'muffins' | 'chocolate-spread' | 'chinut';

type CatalogSectionProps = {
  products: Product[];
};

/**
 * Dedicated Muffin icon (pleated baking liner cup with puffed dome & chocolate chips).
 * Explicitly designed to not look like a croissant.
 */
function MuffinIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Puffed bakery muffin dome */}
      <path d="M4 12c-.7-1.3-.2-2.8.9-3.6 1.2-.9 2.9-.8 4 .2 1-1.4 2.8-2 4.3-1.3 1.2.5 1.9 1.8 1.9 3.1 1-.1 2 .5 2.5 1.4.5.9.4 2.1-.4 2.8H4.8" />
      {/* Pleated muffin cup base */}
      <path d="M5.5 12l1.6 8.2a1 1 0 0 0 1 .8h7.8a1 1 0 0 0 1-.8l1.6-8.2" />
      {/* Liner ridges */}
      <line x1="9" y1="13" x2="9.5" y2="20" />
      <line x1="12" y1="13" x2="12" y2="20" />
      <line x1="15" y1="13" x2="14.5" y2="20" />
      {/* Chocolate chips / berries */}
      <circle cx="8.5" cy="8.5" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="13" cy="7" r="0.75" fill="currentColor" stroke="none" />
      <circle cx="16" cy="9.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Dedicated Chocolate Jar icon (glass spread jar with lid, collar, label, and chocolate drop).
 */
function ChocolateJarIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Jar lid */}
      <rect x="7" y="2.5" width="10" height="3" rx="1" />
      {/* Jar neck collar */}
      <path d="M8 5.5v1.5h8V5.5" />
      {/* Jar glass body */}
      <rect x="4.5" y="7" width="15" height="14.5" rx="3" />
      {/* Label outline banner */}
      <path d="M4.5 11.5h15" />
      <path d="M4.5 16.5h15" />
      {/* Cocoa drop inside label */}
      <path
        d="M12 12.8c-.8.9-1 1.5-1 2.2a1 1 0 0 0 2 0c0-.7-.2-1.3-1-2.2Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

export function CatalogSection({ products }: CatalogSectionProps) {
  const [activeTab, setActiveTab] = useState<FilterTag>('all');

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    const nameLower = p.name.toLowerCase();
    const slugLower = p.slug.toLowerCase();

    if (activeTab === 'cupcakes') {
      const isMuffin = slugLower.includes('muffin') || nameLower.includes('muffin');
      const isCakeOrCupcake =
        p.category === 'cakes' ||
        slugLower.includes('cake') ||
        slugLower.includes('cupcake') ||
        nameLower.includes('cake') ||
        nameLower.includes('cupcake');
      return isCakeOrCupcake && !isMuffin;
    }

    if (activeTab === 'nuts') {
      const isChinut = slugLower.includes('chinut') || nameLower.includes('chinut');
      const isSpread = slugLower.includes('spread') || nameLower.includes('spread');
      return p.category === 'nuts' && !isChinut && !isSpread;
    }

    if (activeTab === 'muffins') {
      return slugLower.includes('muffin') || nameLower.includes('muffin');
    }

    if (activeTab === 'chocolate-spread') {
      return slugLower.includes('spread') || nameLower.includes('spread');
    }

    if (activeTab === 'chinut') {
      return slugLower.includes('chinut') || nameLower.includes('chinut');
    }

    return true;
  });

  return (
    <section id="catalog" className="py-10 sm:py-14 bg-surface-variant scroll-mt-20 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 xl:px-20">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="font-display italic text-base sm:text-lg text-primary">
            Fresh From Our Kitchen
          </span>
          <h2 className="font-display font-medium text-2xl sm:text-3xl text-on-surface mt-1.5 uppercase tracking-tight">
            Browse Our Full Catalog
          </h2>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {/* Tag 1: All Specialties (untouched) */}
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`min-h-[44px] px-6 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 ${
              activeTab === 'all'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            All Specialties ({products.length})
          </button>

          {/* Tag 2: Cupcakes */}
          <button
            id="tab-cupcakes"
            type="button"
            onClick={() => setActiveTab('cupcakes')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 flex items-center space-x-2 ${
              activeTab === 'cupcakes'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            <Cake className="w-4 h-4" />
            <span>Cupcakes</span>
          </button>

          {/* Tag 3: Nuts */}
          <button
            id="tab-nuts"
            type="button"
            onClick={() => setActiveTab('nuts')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 flex items-center space-x-2 ${
              activeTab === 'nuts'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            <Nut className="w-4 h-4" />
            <span>Nuts</span>
          </button>

          {/* Tag 4: Muffins (Custom Muffin icon, NOT croissant) */}
          <button
            id="tab-muffins"
            type="button"
            onClick={() => setActiveTab('muffins')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 flex items-center space-x-2 ${
              activeTab === 'muffins'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            <MuffinIcon className="w-4 h-4" />
            <span>Muffins</span>
          </button>

          {/* Tag 5: Chocolate Spread (Custom Chocolate Jar icon) */}
          <button
            id="tab-chocolate-spread"
            type="button"
            onClick={() => setActiveTab('chocolate-spread')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 flex items-center space-x-2 ${
              activeTab === 'chocolate-spread'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            <ChocolateJarIcon className="w-4 h-4" />
            <span>Chocolate Spread</span>
          </button>

          {/* Tag 6: Chinut */}
          <button
            id="tab-chinut"
            type="button"
            onClick={() => setActiveTab('chinut')}
            className={`min-h-[44px] px-5 py-2.5 rounded-full text-sm font-semibold font-body transition-all active:scale-95 flex items-center space-x-2 ${
              activeTab === 'chinut'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface text-on-surface border border-outline-variant hover:border-outline'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Chinut</span>
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
