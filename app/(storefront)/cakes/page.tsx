import React from 'react';
import { Clock, Sparkles } from 'lucide-react';
import { getProducts } from '@/lib/products';
import { ProductCard } from '@/components/storefront/ProductCard';

export const metadata = {
  title: 'Celebration Cakes & Cupcakes | Mesxico Cakes & Nuts',
  description:
    'Custom celebration cakes, assorted party platters, and luxury cupcakes baked to order in Lagos with a guaranteed 48-hour delivery schedule.',
};

export default async function CakesPage() {
  const cakeProducts = await getProducts({ category: 'cakes' });

  return (
    <div className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-10">
          <div className="inline-flex items-center space-x-2 bg-primary-container text-on-primary-container px-3.5 py-1.5 rounded-full text-xs font-semibold font-body">
            <Clock className="w-3.5 h-3.5" />
            <span>Strict 48-Hour Advance Notice Required</span>
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-on-surface">
            Celebration Cakes &amp; Cupcakes
          </h1>
          <p className="text-base text-on-surface-variant font-body leading-relaxed">
            Every celebration cake is whipped, baked, and decorated fresh for your date. You can add your personalized celebration message during checkout.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {cakeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Custom Order Assistance Notice */}
        <div className="mt-16 bg-surface-variant/30 rounded-2xl p-8 border border-outline-variant text-center max-w-2xl mx-auto space-y-3">
          <Sparkles className="w-6 h-6 text-primary mx-auto" />
          <h3 className="font-display font-semibold text-xl text-on-surface">
            Need a Bespoke Tiered Wedding Cake?
          </h3>
          <p className="text-sm text-on-surface-variant font-body">
            For multi-tier custom event cakes requiring 5+ days preparation, contact our kitchen team directly via WhatsApp at{' '}
            <a
              href="https://wa.me/2347030420150?text=Hello%20Mesxico!%20I%20need%20a%20bespoke%20event%20cake."
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              +234 7030420150
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
