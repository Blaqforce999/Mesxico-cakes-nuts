'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, Plus, Minus, ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { useModalStore } from '@/lib/modal-store';
import { useCartStore } from '@/lib/cart/cart-store';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function ProductDetailModal() {
  const isProductModalOpen = useModalStore((state) => state.isProductModalOpen);
  const product = useModalStore((state) => state.selectedProduct);
  const closeProductModal = useModalStore((state) => state.closeProductModal);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const [quantity, setQuantity] = useState(1);
  const [customMessage, setCustomMessage] = useState('');
  const [added, setAdded] = useState(false);

  // Sync state when active product changes
  useEffect(() => {
    if (product) {
      setQuantity(1);
      setCustomMessage('');
      setAdded(false);
    }
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isProductModalOpen) {
        closeProductModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isProductModalOpen, closeProductModal]);

  // Prevent background page scrolling when modal is open
  useEffect(() => {
    if (isProductModalOpen) {
      const originalBodyOverflow = document.body.style.overflow;
      const originalHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalHtmlOverflow;
      };
    }
  }, [isProductModalOpen]);

  // Handle browser back button to close modal
  useEffect(() => {
    const handlePopState = () => {
      if (isProductModalOpen) {
        useModalStore.setState({ isProductModalOpen: false, selectedProduct: null });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isProductModalOpen]);

  if (!isProductModalOpen || !product) return null;

  const isCake = product.category === 'cakes';
  const primaryImage = product.images[0] || '/product_images/cupcake_single.jpeg';
  const totalPriceKobo = product.price_kobo * quantity;

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    addItem(product, quantity, customMessage.trim() || undefined);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    addItem(product, quantity, customMessage.trim() || undefined);
    closeProductModal();
    openCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-6">
      {/* Backdrop — Only closes when user clicks the X icon */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
        style={{ touchAction: 'none' }}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-product-title"
        className="relative w-full max-w-2xl bg-surface rounded-3xl shadow-2xl border border-outline-variant/60 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Sticky Close Button */}
        <button
          type="button"
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-surface/90 backdrop-blur-md text-on-surface hover:bg-surface-variant hover:text-primary transition-all shadow-sm min-h-[44px] min-w-[44px] flex items-center justify-center border border-outline-variant/50"
          aria-label="Close product details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content Container */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
            
            {/* Left: Product Image */}
            <div className="sm:col-span-5 relative aspect-square w-full rounded-2xl overflow-hidden bg-surface-variant/40 border border-outline-variant/50 flex items-center justify-center p-4">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className="object-contain p-2 drop-shadow-md"
                priority
              />
            </div>

            {/* Right: Product Info & Price */}
            <div className="sm:col-span-7 space-y-3">
              <div>
                <h2
                  id="modal-product-title"
                  className="font-display font-bold text-xl sm:text-2xl text-on-surface leading-snug"
                >
                  {product.name}
                </h2>
              </div>

              {/* Price */}
              <div className="flex items-baseline space-x-3 pt-1 border-t border-outline-variant/40">
                <span className="font-display font-bold text-2xl sm:text-3xl text-primary">
                  {formatNaira(totalPriceKobo)}
                </span>
                {quantity > 1 && (
                  <span className="text-xs text-outline font-body">
                    ({formatNaira(product.price_kobo)} each)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-on-surface-variant font-body leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>

          {/* Configuration Form */}
          <form onSubmit={handleAddToCart} className="space-y-5 pt-2 border-t border-outline-variant/40">
            {/* Custom Inscription for Celebration Cakes */}
            {isCake && (
              <div className="space-y-1.5">
                <label
                  htmlFor="modal-cake-message"
                  className="block text-xs font-semibold uppercase tracking-wider text-on-surface font-body"
                >
                  Customize your cake:
                </label>
                <textarea
                  id="modal-cake-message"
                  rows={2}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="e.g., Happy 30th Birthday Tobi! 💖"
                  maxLength={60}
                  className="w-full px-3.5 py-2 rounded-xl border border-outline-variant bg-surface text-on-surface placeholder:text-outline font-body text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <span className="text-[11px] text-outline block text-right">
                  {customMessage.length}/60 characters
                </span>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-variant/30 border border-outline-variant/40">
              <span className="text-xs sm:text-sm font-semibold text-on-surface font-body">
                Select Quantity:
              </span>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-surface text-on-surface hover:bg-surface-variant disabled:opacity-40 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="font-display font-bold text-base w-6 text-center text-on-surface">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-full border border-outline-variant bg-surface text-on-surface hover:bg-surface-variant flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons: Add to Cart & Instant Checkout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full min-h-[48px] space-x-2 cursor-pointer"
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="primary"
                size="lg"
                onClick={handleBuyNow}
                className="w-full min-h-[48px] space-x-2 cursor-pointer"
              >
                <span>Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
