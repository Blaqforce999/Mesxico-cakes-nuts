'use client';

import React, { useState } from 'react';
import { ShoppingBag, Clock, Plus, Minus, Check, Calendar } from 'lucide-react';
import { Product } from '@/types/database';
import { formatNaira, getEarliestDeliveryDate, formatDisplayDate } from '@/lib/utils';
import { useCartStore } from '@/lib/cart/cart-store';
import { Button } from '@/components/ui/Button';

type ProductDetailFormProps = {
  product: Product;
};

export function ProductDetailForm({ product }: ProductDetailFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedFlavor, setSelectedFlavor] = useState<string>(
    product.flavor_options?.[0] || ''
  );
  const [customMessage, setCustomMessage] = useState('');
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const isCake = product.category === 'cakes';
  const earliestDate = getEarliestDeliveryDate(product.lead_time_hours);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(product, quantity, customMessage.trim() || undefined, selectedFlavor || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const totalPriceKobo = product.price_kobo * quantity;

  return (
    <form onSubmit={handleAddToCart} className="space-y-6 pt-2">
      {/* Price Display */}
      <div className="flex items-baseline space-x-3">
        <span className="font-body font-bold text-3xl sm:text-4xl text-primary">
          {formatNaira(totalPriceKobo)}
        </span>
        {quantity > 1 && (
          <span className="text-xs text-outline font-body">
            ({formatNaira(product.price_kobo)} each)
          </span>
        )}
      </div>

      {/* Flavor Selection (if available) */}
      {product.flavor_options && product.flavor_options.length > 0 && (
        <div className="space-y-2.5">
          <label className="block text-sm font-semibold text-on-surface font-body">
            Select Flavor / Variety:
          </label>
          <div className="flex flex-wrap gap-2">
            {product.flavor_options.map((flavor) => (
              <button
                key={flavor}
                type="button"
                onClick={() => setSelectedFlavor(flavor)}
                className={`min-h-[44px] px-4 py-2 rounded-full text-xs font-medium font-body border transition-all ${
                  selectedFlavor === flavor
                    ? 'bg-primary text-on-primary border-primary shadow-xs'
                    : 'bg-surface text-on-surface border-outline-variant hover:border-outline'
                }`}
              >
                {flavor}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Custom Cake Inscription (for cakes) */}
      {isCake && (
        <div className="space-y-2">
          <label
            htmlFor="cake-message"
            className="block text-sm font-semibold text-on-surface font-body"
          >
            Custom Inscription on Cake or Gift Card (Optional):
          </label>
          <textarea
            id="cake-message"
            rows={2}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="e.g., Happy 30th Birthday Tobi! 💖"
            maxLength={60}
            className="w-full px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface placeholder:text-outline font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <span className="text-[11px] text-outline block text-right">
            {customMessage.length}/60 characters
          </span>
        </div>
      )}

      {/* Lead-Time Notice Box */}
      <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-200/80 text-xs text-amber-950 font-body space-y-1">
        <div className="flex items-center space-x-2 font-semibold text-amber-900">
          <Calendar className="w-4 h-4 text-amber-700" />
          <span>
            {isCake
              ? '48-Hour Advance Lead Time'
              : 'Next-Day Delivery Notice'}
          </span>
        </div>
        <p className="text-amber-800">
          Order today to schedule delivery for <strong>{formatDisplayDate(earliestDate)}</strong> or later at checkout.
        </p>
      </div>

      {/* Quantity Selector and Add to Cart */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
        {/* Quantity Controls */}
        <div className="flex items-center justify-between border border-outline-variant rounded-full bg-surface px-4 py-2 min-h-[44px] sm:w-36">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="text-on-surface hover:text-primary transition-colors p-1"
            aria-label="Decrease quantity"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="font-semibold text-sm font-body text-on-surface">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="text-on-surface hover:text-primary transition-colors p-1"
            aria-label="Increase quantity"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="flex-1 min-h-[48px] space-x-2"
        >
          {added ? (
            <>
              <Check className="w-5 h-5 text-on-primary" />
              <span>Added to Cart!</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-5 h-5" />
              <span>Add to Cart • {formatNaira(totalPriceKobo)}</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
