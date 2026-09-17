'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart/cart-store';
import { formatNaira } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

// Standard Lagos local delivery fee in kobo: ₦2,500 = 250,000 kobo
const STANDARD_DELIVERY_FEE_KOBO = 250000;

// The storefront's WhatsApp ordering line, matched to ContactSection / FloatingActions.
const WHATSAPP_NUMBER = '2347030420150';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalKobo = useCartStore((state) => state.getTotalKobo());

  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const grandTotalKobo = totalKobo + (items.length > 0 ? STANDARD_DELIVERY_FEE_KOBO : 0);

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!customerName || !customerPhone || !deliveryAddress) {
      setErrorMessage('Please fill in your name, phone number, and delivery address.');
      return;
    }

    const itemLines: string[] = [];
    items.forEach((item, index) => {
      const lineTotal = formatNaira(item.product.price_kobo * item.quantity);
      itemLines.push(`${index + 1}. ${item.product.name} - Qty ${item.quantity} - ${lineTotal}`);
      if (item.selectedFlavor) {
        itemLines.push(`   Flavor: ${item.selectedFlavor}`);
      }
      if (item.customMessage) {
        itemLines.push(`   Note: ${item.customMessage}`);
      }
      itemLines.push('');
    });

    const messageLines = [
      "Hi Mesxico Cakes & Nuts! I'd like to place an order for:",
      '',
      ...itemLines,
      `Subtotal: ${formatNaira(totalKobo)}`,
      `Delivery fee: ${formatNaira(STANDARD_DELIVERY_FEE_KOBO)}`,
      `Total: ${formatNaira(grandTotalKobo)}`,
      '',
      `Name: ${customerName}`,
      `Phone: ${customerPhone}`,
      `Address: ${deliveryAddress}`,
    ];

    if (deliveryNotes) {
      messageLines.push(`Notes: ${deliveryNotes}`);
    }

    messageLines.push('', 'Thank you!');

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageLines.join('\n'))}`;

    window.open(whatsappUrl, '_blank');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="py-20 max-w-2xl mx-auto px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-surface-variant flex items-center justify-center mx-auto text-outline">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl text-on-surface">
            Your Cart is Empty
          </h1>
          <p className="text-sm text-on-surface-variant font-body">
            You have not added any celebration cakes or gourmet nuts to your cart yet.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 bg-primary text-on-primary font-body font-semibold px-6 py-3 rounded-full text-sm min-h-[44px]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs font-body text-outline hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface mt-2">
            Review Your Cart
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-error text-sm font-body flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cart Items List */}
            <div className="bg-surface rounded-2xl border border-outline-variant/60 p-5 space-y-4 shadow-xs">
              <h2 className="font-display font-semibold text-lg text-on-surface pb-3 border-b border-outline-variant/40">
                Order Items ({items.reduce((acc, i) => acc + i.quantity, 0)})
              </h2>

              <div className="divide-y divide-outline-variant/40 space-y-4">
                {items.map((item, index) => (
                  <div
                    key={`${item.product.id}-${index}`}
                    className="pt-4 first:pt-0 flex items-start space-x-4"
                  >
                    <div
                      style={{ backgroundColor: 'var(--color-surface-variant)' }}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-outline-variant/60 shrink-0 flex items-center justify-center p-2"
                    >
                      <Image
                        src={item.product.images[0] || '/products/cupcake_single.jpeg'}
                        alt={item.product.name}
                        fill
                        className="object-contain p-1 drop-shadow-sm"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-base text-on-surface truncate">
                        {item.product.name}
                      </h3>
                      {item.selectedFlavor && (
                        <p className="text-xs text-on-surface-variant font-body">
                          Flavor: <span className="font-medium">{item.selectedFlavor}</span>
                        </p>
                      )}
                      {item.customMessage && (
                        <p className="text-xs text-primary font-body italic mt-0.5">
                          Note: &quot;{item.customMessage}&quot;
                        </p>
                      )}
                      <p className="text-xs font-semibold text-outline font-body mt-1">
                        {formatNaira(item.product.price_kobo)} each
                      </p>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      <span className="font-display font-bold text-base text-primary">
                        {formatNaira(item.product.price_kobo * item.quantity)}
                      </span>

                      <div className="flex items-center space-x-2 border border-outline-variant rounded-lg bg-surface px-1 py-0.5">
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
                          className="p-1 text-on-surface hover:text-primary transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold font-body w-5 text-center">
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
                          className="p-1 text-on-surface hover:text-primary transition-colors min-h-[30px] min-w-[30px] flex items-center justify-center"
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
                        className="text-xs text-error hover:underline flex items-center space-x-1"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Contact Info & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 space-y-5 shadow-xs">
              <h2 className="font-display font-semibold text-lg text-on-surface pb-3 border-b border-outline-variant/40">
                Customer &amp; Address Details
              </h2>

              <Input
                label="Full Name"
                required
                placeholder="e.g., Folake Adebayo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <Input
                label="Phone Number"
                type="tel"
                required
                placeholder="08012345678"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
              />

              <Textarea
                label="Full Delivery Address"
                required
                rows={2}
                placeholder="Street address, Estate/Apartment, Area, Lagos"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />

              <Textarea
                label="Special Delivery Notes (Optional)"
                rows={2}
                placeholder="e.g. Call when gatekeeper opens, or delivery landmark"
                value={deliveryNotes}
                onChange={(e) => setDeliveryNotes(e.target.value)}
              />

              {/* Order Summary Pricing */}
              <div className="pt-4 border-t border-outline-variant/60 space-y-2">
                <div className="flex justify-between text-sm font-body text-on-surface-variant">
                  <span>Items Subtotal</span>
                  <span className="font-semibold text-on-surface">
                    {formatNaira(totalKobo)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-body text-on-surface-variant">
                  <span>Lagos Doorstep Delivery</span>
                  <span className="font-semibold text-on-surface">
                    {formatNaira(STANDARD_DELIVERY_FEE_KOBO)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-body font-bold text-on-surface pt-2 border-t border-outline-variant">
                  <span>Total Due</span>
                  <span className="font-display text-2xl text-primary font-bold">
                    {formatNaira(grandTotalKobo)}
                  </span>
                </div>
              </div>

              {/* Place Order Now Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full min-h-[50px] text-base space-x-2 mt-4"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Place Order Now • {formatNaira(grandTotalKobo)}</span>
              </Button>

              <div className="flex items-center justify-center space-x-2 text-xs text-outline font-body pt-1">
                <span>You&apos;ll be redirected to WhatsApp to confirm your order</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
