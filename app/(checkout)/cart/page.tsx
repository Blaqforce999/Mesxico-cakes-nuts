'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useCartStore } from '@/lib/cart/cart-store';
import { formatNaira, getEarliestDeliveryDate, formatDisplayDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

// Standard Lagos local delivery fee in kobo: ₦2,500 = 250,000 kobo
const STANDARD_DELIVERY_FEE_KOBO = 250000;

export default function CartPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const totalKobo = useCartStore((state) => state.getTotalKobo());
  const leadTimeHours = useCartStore((state) => state.getLeadTimeHours());

  const earliestDate = getEarliestDeliveryDate(leadTimeHours);

  // Form State
  const [deliveryDate, setDeliveryDate] = useState(earliestDate);
  const [deliveryTimeSlot, setDeliveryTimeSlot] = useState('Morning (9:00 AM - 12:00 PM)');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const grandTotalKobo = totalKobo + (items.length > 0 ? STANDARD_DELIVERY_FEE_KOBO : 0);
  const hasCakes = items.some((i) => i.product.category === 'cakes');

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    if (!deliveryDate || deliveryDate < earliestDate) {
      setErrorMessage(
        `Selected delivery date must be on or after ${formatDisplayDate(earliestDate)} due to order preparation lead times.`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.product.id,
            quantity: i.quantity,
            customMessage: i.customMessage || null,
            selectedFlavor: i.selectedFlavor || null,
          })),
          customerName,
          customerEmail,
          customerPhone,
          deliveryAddress,
          deliveryDate,
          deliveryTimeSlot,
          deliveryNotes: deliveryNotes || null,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error?.message || 'Failed to initialize payment.');
      }

      // Redirect to Flutterwave hosted payment link
      if (result.data?.paymentLink) {
        window.location.href = result.data.paymentLink;
      } else {
        // Direct to verify page for testing/local preview
        router.push(`/order/verify?order_number=${result.data?.orderNumber}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
      setErrorMessage(message);
      setIsSubmitting(false);
    }
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
            Review Cart &amp; Schedule Delivery
          </h1>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-error text-sm font-body flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Cart Items & Lead Time Notice */}
          <div className="lg:col-span-7 space-y-6">
            {/* Lead Time Notice Banner */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 space-y-2 font-body">
              <div className="flex items-center space-x-2 font-bold text-amber-900 text-sm">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>
                  {hasCakes
                    ? '48-Hour Advance Notice Enforced (Cake in Cart)'
                    : '24-Hour Next-Day Dispatch (Nuts Only)'}
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                {hasCakes
                  ? 'Custom cakes are freshly baked from scratch for your special day. The earliest available date for this order is '
                  : 'Your gourmet nuts are ready for swift dispatch. Earliest available date is '}
                <strong>{formatDisplayDate(earliestDate)}</strong>.
              </p>
            </div>

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

          {/* Right Column: Delivery Scheduling & Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-surface rounded-2xl border border-outline-variant/60 p-6 space-y-5 shadow-xs">
              <h2 className="font-display font-semibold text-lg text-on-surface pb-3 border-b border-outline-variant/40">
                Delivery Scheduling
              </h2>

              {/* Delivery Date Picker (Enforces Lead Time) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="delivery-date"
                  className="block text-sm font-semibold text-on-surface font-body"
                >
                  Select Delivery Date <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    id="delivery-date"
                    required
                    min={earliestDate}
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <p className="text-[11px] text-outline font-body">
                  Earliest selectable date: {formatDisplayDate(earliestDate)}
                </p>
              </div>

              {/* Time Slot Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="delivery-time"
                  className="block text-sm font-semibold text-on-surface font-body"
                >
                  Preferred Delivery Window <span className="text-error">*</span>
                </label>
                <select
                  id="delivery-time"
                  value={deliveryTimeSlot}
                  onChange={(e) => setDeliveryTimeSlot(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-lg border border-outline-variant bg-surface text-on-surface font-body text-base focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Morning (9:00 AM - 12:00 PM)">
                    Morning (9:00 AM - 12:00 PM)
                  </option>
                  <option value="Afternoon (1:00 PM - 5:00 PM)">
                    Afternoon (1:00 PM - 5:00 PM)
                  </option>
                </select>
              </div>

              <h2 className="font-display font-semibold text-lg text-on-surface pt-4 pb-2 border-b border-outline-variant/40">
                Customer &amp; Address Details
              </h2>

              <Input
                label="Full Name"
                required
                placeholder="e.g., Folake Adebayo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Email Address"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />
                <Input
                  label="Phone Number"
                  type="tel"
                  required
                  placeholder="08012345678"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                />
              </div>

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
                <p className="text-[11px] text-outline text-right font-body">
                  Internal storage: {grandTotalKobo} kobo
                </p>
              </div>

              {/* Pay Now Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full min-h-[50px] text-base space-x-2 mt-4"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Pay Now with Flutterwave • {formatNaira(grandTotalKobo)}</span>
              </Button>

              <div className="flex items-center justify-center space-x-2 text-xs text-outline font-body pt-1">
                <span>🔒 256-bit encrypted secure payment</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
