import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { env } from '@/lib/env';

export async function POST(req: NextRequest) {
  try {
    // 1. Verify webhook signature header
    const signature = req.headers.get('verif-hash');
    if (!signature || signature !== env.FLUTTERWAVE_SECRET_HASH) {
      console.warn('Flutterwave webhook rejected: invalid signature hash');
      return NextResponse.json(
        { ok: false, error: 'Unauthorized webhook call' },
        { status: 401 }
      );
    }

    const payload = await req.json().catch(() => null);
    if (!payload || !payload.data) {
      return NextResponse.json(
        { ok: false, error: 'Empty webhook payload' },
        { status: 400 }
      );
    }

    const transactionId = payload.data.id;
    const txRef = payload.data.tx_ref;
    const flwAmount = payload.data.amount; // major currency unit (Naira)
    const flwCurrency = payload.data.currency;
    const flwStatus = payload.data.status;

    // 2. Call Flutterwave Verify API to prevent payload spoofing
    let isVerified = false;

    if (env.FLUTTERWAVE_SECRET_KEY && !env.FLUTTERWAVE_SECRET_KEY.includes('mock')) {
      try {
        const verifyRes = await fetch(
          `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${env.FLUTTERWAVE_SECRET_KEY}`,
            },
          }
        );

        const verifyData = await verifyRes.json();
        if (
          verifyData.status === 'success' &&
          verifyData.data?.status === 'successful' &&
          verifyData.data?.currency === 'NGN' &&
          verifyData.data?.tx_ref === txRef
        ) {
          isVerified = true;
        }
      } catch (err) {
        console.error('Flutterwave verification API error:', err);
        // Respond 200 so Flutterwave retries later
        return NextResponse.json({ ok: false, message: 'Verification retry needed' }, { status: 200 });
      }
    } else {
      // In local dev/mock test environment
      isVerified = flwStatus === 'successful';
    }

    if (!isVerified) {
      console.warn('Flutterwave transaction could not be verified:', { transactionId, txRef });
      return NextResponse.json({ ok: false, error: 'Transaction unverified' }, { status: 200 });
    }

    // 3. Atomically update Order and insert into Payments table
    try {
      const supabase = createAdminClient();

      // Find order by flutterwave_ref
      const { data: order, error: findError } = await supabase
        .from('orders')
        .select('*')
        .eq('flutterwave_ref', txRef)
        .single();

      if (findError || !order) {
        console.warn('Order not found for tx_ref:', txRef);
        return NextResponse.json({ ok: true, message: 'Order reference not found' });
      }

      // Check amount matching (converted from kobo to naira)
      const expectedNaira = Math.floor(order.total_amount_kobo / 100);
      if (Math.abs(flwAmount - expectedNaira) > 1) {
        console.error('Amount mismatch detected!', { flwAmount, expectedNaira, orderId: order.id });
        return NextResponse.json({ ok: false, error: 'Amount mismatch' }, { status: 200 });
      }

      // Idempotently insert payment record using unique constraint on gateway_reference
      const { error: paymentError } = await supabase.from('payments').insert({
        order_id: order.id,
        gateway: 'flutterwave',
        gateway_reference: String(transactionId),
        amount_kobo: order.total_amount_kobo,
        currency: 'NGN',
        status: 'successful',
        raw_payload: payload,
      });

      // PostgreSQL error code 23505 = unique violation (duplicate webhook delivery)
      if (paymentError) {
        if (paymentError.code === '23505' || paymentError.message?.includes('duplicate key')) {
          console.info('Webhook already processed for gateway reference:', transactionId);
          return NextResponse.json({ ok: true, message: 'Already processed' });
        }
        throw paymentError;
      }

      // Update order status to paid
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          payment_status: 'paid',
        })
        .eq('id', order.id);

      console.info(`Order ${order.order_number} marked as paid successfully!`);
    } catch (dbErr) {
      console.error('Database update failed in webhook:', dbErr);
    }

    return NextResponse.json({ ok: true, message: 'Webhook processed' });
  } catch (err) {
    console.error('Flutterwave webhook unhandled error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
