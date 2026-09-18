'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Calendar, AlertCircle } from 'lucide-react';
import { useCartStore } from '@/lib/cart/cart-store';
import { formatNaira, getEarliestDeliveryDate, formatDisplayDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const isOpen = useCartStore((state) => state.isOpen);
  const closeCart = useCartStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalKobo = useCartStore((state) => state.getTotalKobo());
  const leadTimeHours = useCartStore((state) => state.getLeadTimeHours());

  if (!isOpen) return null;

  const earliestDate = getEarliestDeliveryDate(leadTimeHours);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-on-surface/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-outline-variant flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-[18px] leading-[1.4] text-on-surface">
                Your Fresh Cart
              </h2>
              <span className="bg-primary-container text-on-primary-container text-xs font-bold px-2 py-0.5 rounded-full font-body">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-2 rounded-full bg-[#F3DDDE66] text-on-surface hover:bg-surface-variant min-h-[44px] min-w-[44px] flex items-center justify-center transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center text-outline">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-body font-semibold text-lg text-on-surface">
                    Your cart is empty
                  </h3>
                  <p className="text-xs text-on-surface-variant max-w-xs font-body">
                    Add custom baked cakes or crunchy gourmet nuts to start your order.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="md"
                  onClick={closeCart}
                  className="mt-2"
                >
                  Explore Catalog
                </Button>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.product.id}-${index}-${item.selectedFlavor || ''}-${item.customMessage || ''}`}
                  className="flex space-x-3.5 p-3.5 bg-surface-variant/20 rounded-xl border border-outline-variant/60"
                >
                  <div
                    style={{ backgroundColor: 'var(--color-surface-variant)' }}
                    className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-outline-variant/60 flex items-center justify-center p-2"
                  >
                    <Image
                      src={item.product.images[0] || '/products/cupcake_single.jpeg'}
                      alt={item.product.name}
                      fill
                      className="object-contain p-1 drop-shadow-sm"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-body font-semibold text-sm text-on-surface line-clamp-1">
                        {item.product.name}
                      </h4>
                      {item.selectedFlavor && (
                        <p className="text-xs text-on-surface-variant font-body mt-0.5">
                          Flavor: <span className="font-medium">{item.selectedFlavor}</span>
                        </p>
                      )}
                      {item.customMessage && (
                        <p className="text-xs text-primary font-body mt-0.5 italic line-clamp-1">
                          &quot;{item.customMessage}&quot;
                        </p>
                      )}
                      <p className="text-xs font-bold text-primary font-body mt-1">
                        {formatNaira(item.product.price_kobo * item.quantity)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/30">
                      <div className="flex items-center space-x-2 bg-surface rounded-lg border border-outline-variant px-1.5 py-0.5">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.customMessage,
                              item.selectedFlavor
                            )
                          }
                          className="p-1 text-on-surface hover:text-primary transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-semibold font-body w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.customMessage,
                              item.selectedFlavor
                            )
                          }
                          className="p-1 text-on-surface hover:text-primary transition-colors min-h-[32px] min-w-[32px] flex items-center justify-center"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.customMessage,
                            item.selectedFlavor
                          )
                        }
                        className="text-outline hover:text-error transition-colors p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Call-to-Action */}
          {items.length > 0 && (
            <div className="p-5 border-t border-outline-variant bg-surface space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm font-body text-on-surface-variant">
                  <span>Subtotal</span>
                  <span className="font-semibold text-on-surface">
                    {formatNaira(totalKobo)}
                  </span>
                </div>
                <div className="flex justify-between text-xs font-body text-outline">
                  <span>Delivery fee</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-base font-body font-bold text-on-surface pt-2 border-t border-outline-variant/60">
                  <span>Total</span>
                  <span className="font-body text-xl text-primary font-bold">
                    {formatNaira(totalKobo)}
                  </span>
                </div>
              </div>

              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full inline-flex items-center justify-center space-x-2 bg-primary text-on-primary hover:opacity-90 active:scale-[0.98] font-body font-semibold py-3 px-6 rounded-full text-base min-h-[48px] shadow-sm transition-all"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
