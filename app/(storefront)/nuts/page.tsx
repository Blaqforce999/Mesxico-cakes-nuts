import React from 'react';
import { Truck, ShieldCheck, Nut } from 'lucide-react';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/storefront/ProductCard';

export const metadata = {
  title: 'Gourmet Packaged Nuts & Spreads | Mesxico Cakes & Nuts',
  description:
    'Hand-roasted Nigerian cashews, traditional roasted groundnuts, spiced chinut snacks, and artisanal nut spreads with next-day delivery in Lagos.',
};

export default async function NutsPage() {
  const nutProducts = await getProducts({ category: 'nuts' });

  return (
    <div className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 bg-secondary-container text-on-secondary-container px-3.5 py-1.5 rounded-full text-xs font-semibold font-body">
            <Truck className="w-3.5 h-3.5" />
            <span>Fast Next-Day Doorstep Dispatch</span>
          </div>
          <h1 className="font-display font-bold text-[33px] sm:text-[44px] leading-[1.111] sm:leading-[1] text-on-surface">
            Gourmet Packaged Nuts &amp; Spreads
          </h1>
          <p className="text-base text-on-surface-variant font-body leading-relaxed">
            Slow-roasted to golden crunch in small batches. Sealed in reusable glass jars and airtight pouches to keep every bite crisp and savory.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {nutProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Freshness Badge Box */}
        <div className="mt-16 bg-surface-variant/30 rounded-2xl p-8 border border-outline-variant text-center max-w-2xl mx-auto space-y-3">
          <ShieldCheck className="w-6 h-6 text-secondary mx-auto" />
          <h3 className="font-display font-semibold text-[18px] leading-[1.4] text-on-surface">
            The Mesxico Freshness Lock
          </h3>
          <p className="text-sm text-on-surface-variant font-body">
            All our nut jars and bulk pouches are foil-sealed immediately after roasting to ensure maximum crunch and zero rancidity for up to 6 months.
          </p>
        </div>
      </div>
    </div>
  );
}
