import { NextRequest, NextResponse } from 'next/server';
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

    console.info(`Payment verified for tx_ref ${txRef}`, { transactionId, flwAmount, flwCurrency });

    return NextResponse.json({ ok: true, message: 'Webhook processed' });
  } catch (err) {
    console.error('Flutterwave webhook unhandled error:', err);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
