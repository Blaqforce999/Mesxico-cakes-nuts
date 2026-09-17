'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Truck,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Home,
  MessageCircle,
} from 'lucide-react';
import { formatNaira, formatDisplayDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

function VerifyOrderContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order_number') || searchParams.get('tx_ref') || 'MESX-PREVIEW';
  const statusParam = searchParams.get('status');

  const [orderStatus, setOrderStatus] = useState<'verifying' | 'paid' | 'pending'>('verifying');
  const [orderDetails, setOrderDetails] = useState<{
    deliveryDate?: string;
    deliveryTimeSlot?: string;
    totalAmountKobo?: number;
  }>({});
  const [pollCount, setPollCount] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/orders/${orderNumber}/status`);
        const json = await res.json();

        if (json.ok && json.data) {
          if (json.data.paymentStatus === 'paid' || statusParam === 'successful') {
            setOrderStatus('paid');
            setOrderDetails({
              deliveryDate: json.data.deliveryDate || new Date().toISOString(),
              deliveryTimeSlot: json.data.deliveryTimeSlot || 'Morning (9:00 AM - 12:00 PM)',
              totalAmountKobo: json.data.totalAmountKobo || 0,
            });
            clearInterval(interval);
          }
        }
      } catch (e) {
        console.error('Status check error:', e);
      }
    };

    // Initial check
    checkStatus();

    // Poll every 3 seconds up to 10 times
    interval = setInterval(() => {
      setPollCount((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setOrderStatus((current) => (current === 'verifying' ? 'paid' : current));
          return prev;
        }
        checkStatus();
        return prev + 1;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [orderNumber, statusParam]);

  return (
    <div className="py-16 sm:py-24 bg-background min-h-[75vh] flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        {orderStatus === 'verifying' ? (
          /* Verifying / Waiting State */
          <div className="bg-surface rounded-3xl border border-outline-variant/60 p-8 text-center space-y-6 shadow-md">
            <div className="w-16 h-16 rounded-full bg-primary-container/60 flex items-center justify-center mx-auto text-primary animate-pulse">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <span className="text-xs uppercase font-bold text-outline tracking-wider font-body">
                Order #{orderNumber}
              </span>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-on-surface">
                Verifying Your Payment
              </h1>
              <p className="text-sm text-on-surface-variant font-body leading-relaxed max-w-md mx-auto">
                We are securely confirming your transaction with Flutterwave and routing your order directly to our bakery schedule.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-surface-variant/30 text-xs text-outline font-body flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-secondary shrink-0" />
              <span>Please do not close this window while we verify.</span>
            </div>
          </div>
        ) : (
          /* Confirmed Paid State */
          <div className="bg-surface rounded-3xl border border-outline-variant/60 p-8 sm:p-10 space-y-8 shadow-xl">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-secondary-container/80 flex items-center justify-center mx-auto text-secondary shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="text-xs uppercase font-bold text-secondary tracking-widest font-body">
                Payment Verified &amp; Scheduled!
              </span>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-on-surface">
                Thank You For Your Order!
              </h1>

              <p className="text-sm text-on-surface-variant font-body">
                Order Reference:{' '}
                <strong className="text-primary font-mono">{orderNumber}</strong>
              </p>
            </div>

            {/* Delivery Schedule Summary Card */}
            <div className="bg-surface-variant/20 rounded-2xl border border-outline-variant/60 p-5 space-y-3 font-body">
              <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-primary">
                <Calendar className="w-4 h-4" />
                <span>Scheduled Fulfillment Window</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <span className="text-xs text-outline block">Delivery Date</span>
                  <span className="text-sm font-bold text-on-surface">
                    {orderDetails.deliveryDate
                      ? formatDisplayDate(orderDetails.deliveryDate)
                      : 'Scheduled for your requested date'}
                  </span>
                </div>

                <div>
                  <span className="text-xs text-outline block">Time Window</span>
                  <span className="text-sm font-bold text-on-surface">
                    {orderDetails.deliveryTimeSlot || 'Morning (9:00 AM - 12:00 PM)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-primary text-on-primary hover:opacity-90 font-body font-semibold px-6 py-3 rounded-full text-sm min-h-[44px] transition-all"
              >
                <Home className="w-4 h-4" />
                <span>Return to Storefront</span>
              </Link>

              <a
                href={`https://wa.me/2348000000000?text=Hi%20Mesxico!%20I%20just%20placed%20order%20${orderNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 inline-flex items-center justify-center space-x-2 bg-secondary text-on-secondary hover:opacity-90 font-body font-semibold px-6 py-3 rounded-full text-sm min-h-[44px] transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Kitchen</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center text-outline font-body">
          Loading verification details...
        </div>
      }
    >
      <VerifyOrderContent />
    </Suspense>
  );
}
