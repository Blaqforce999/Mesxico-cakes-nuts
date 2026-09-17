import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-catalog';
import { env } from '@/lib/env';
import { getEarliestDeliveryDate } from '@/lib/utils';

const STANDARD_DELIVERY_FEE_KOBO = 250000; // ₦2,500

const checkoutInputSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive(),
        customMessage: z.string().nullable().optional(),
        selectedFlavor: z.string().nullable().optional(),
      })
    )
    .min(1, 'Cart must contain at least one item'),
  customerName: z.string().min(2, 'Name is required'),
  customerEmail: z.string().email('Valid email is required'),
  customerPhone: z.string().min(8, 'Valid phone number is required'),
  deliveryAddress: z.string().min(5, 'Delivery address is required'),
  deliveryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Valid delivery date is required'),
  deliveryTimeSlot: z.string().min(1, 'Delivery time slot is required'),
  deliveryNotes: z.string().nullable().optional(),
});

type Success<T> = { ok: true; data: T };
type Failure = { ok: false; error: { code: string; message: string } };

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = checkoutInputSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json<Failure>(
        {
          ok: false,
          error: {
            code: 'invalid_input',
            message: parsed.error.issues[0]?.message || 'Please check your inputs and try again.',
          },
        },
        { status: 400 }
      );
    }

    const {
      items,
      customerName,
      customerEmail,
      customerPhone,
      deliveryAddress,
      deliveryDate,
      deliveryTimeSlot,
      deliveryNotes,
    } = parsed.data;

    // 1. Authoritative price and lead-time calculation from server-side catalog
    let itemsTotalKobo = 0;
    let maxLeadTimeHours = 24;

    for (const item of items) {
      const product = INITIAL_PRODUCTS.find((p) => p.id === item.productId || p.slug === item.productId);
      if (!product) {
        return NextResponse.json<Failure>(
          {
            ok: false,
            error: {
              code: 'product_not_found',
              message: `Product was not found in catalog.`,
            },
          },
          { status: 400 }
        );
      }

      itemsTotalKobo += product.price_kobo * item.quantity;
      if (product.lead_time_hours > maxLeadTimeHours) {
        maxLeadTimeHours = product.lead_time_hours;
      }
    }

    // 2. Validate lead time strictly
    const earliestAllowedDate = getEarliestDeliveryDate(maxLeadTimeHours);
    if (deliveryDate < earliestAllowedDate) {
      return NextResponse.json<Failure>(
        {
          ok: false,
          error: {
            code: 'lead_time_violation',
            message: `Selected date does not satisfy the ${maxLeadTimeHours}h lead-time requirement for items in your cart. Earliest available date is ${earliestAllowedDate}.`,
          },
        },
        { status: 400 }
      );
    }

    const grandTotalKobo = itemsTotalKobo + STANDARD_DELIVERY_FEE_KOBO;
    const orderNumber = `MESX-${Date.now().toString(36).toUpperCase()}`;
    const txRef = `mesxico_ord_${orderNumber}_${Math.random().toString(36).substring(2, 8)}`;

    // 3. Request hosted payment link from Flutterwave
    const amountNaira = Math.floor(grandTotalKobo / 100);
    const redirectUrl = `${env.NEXT_PUBLIC_APP_URL}/order/verify?tx_ref=${txRef}&order_number=${orderNumber}`;

    let paymentLink: string | null = null;

    if (env.FLUTTERWAVE_SECRET_KEY && !env.FLUTTERWAVE_SECRET_KEY.includes('mock')) {
      try {
        const flwResponse = await fetch('https://api.flutterwave.com/v3/payments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${env.FLUTTERWAVE_SECRET_KEY}`,
          },
          body: JSON.stringify({
            tx_ref: txRef,
            amount: amountNaira,
            currency: 'NGN',
            redirect_url: redirectUrl,
            customer: {
              email: customerEmail,
              name: customerName,
              phonenumber: customerPhone,
            },
            customizations: {
              title: 'Mesxico Cakes & Nuts',
              description: `Payment for order ${orderNumber}`,
              logo: `${env.NEXT_PUBLIC_APP_URL}/logo.png`,
            },
            meta: {
              order_number: orderNumber,
              total_amount_kobo: grandTotalKobo,
            },
          }),
        });

        const flwData = await flwResponse.json();
        if (flwData.status === 'success' && flwData.data?.link) {
          paymentLink = flwData.data.link;
        }
      } catch (err) {
        console.error('Flutterwave payment link error:', err);
      }
    }

    // Return success envelope
    return NextResponse.json<
      Success<{
        orderNumber: string;
        txRef: string;
        amountKobo: number;
        paymentLink: string | null;
      }>
    >({
      ok: true,
      data: {
        orderNumber,
        txRef,
        amountKobo: grandTotalKobo,
        paymentLink,
      },
    });
  } catch (error) {
    console.error('api.checkout.failed', { error });
    return NextResponse.json<Failure>(
      {
        ok: false,
        error: {
          code: 'server_error',
          message: 'Unable to initialize checkout. Please try again.',
        },
      },
      { status: 500 }
    );
  }
}
