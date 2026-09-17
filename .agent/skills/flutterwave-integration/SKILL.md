# Flutterwave Integration Skill

Load this skill for any task that touches Flutterwave: creating payment links, verifying transactions, handling webhooks, or debugging payment flows. Do not write Flutterwave code from memory. Flutterwave's API changes, and this skill is the source of truth for how Mesxico Cakes and Nuts uses it.

## What Flutterwave Does for Mesxico Cakes and Nuts

Flutterwave is our payment gateway. It does three things for us:

1. **Hosts the checkout page.** When a buyer clicks "Pay Now," we hand them off to Flutterwave's hosted checkout. We never collect card details in our own UI. This keeps us out of PCI compliance scope.
2. **Processes the payment.** Flutterwave charges the card, handles 3D Secure, handles bank transfers, and settles the money.
3. **Notifies us via webhook.** When a payment succeeds or fails, Flutterwave sends a webhook to our server. The webhook is how we know the truth.

## The Payment Flow End to End

    Buyer clicks "Pay Now"
            |
            v
    POST /api/checkout (creates pending Order, amount in kobo)
            |
            v
    Server calls Flutterwave "create payment link" endpoint
            |
            v
    Server returns hosted checkout URL to the browser
            |
            v
    Browser redirects to Flutterwave
            |
            v
    Buyer pays on Flutterwave's page
            |
            v
    Flutterwave redirects buyer to /order/verify (untrusted, display only)
            |
            v
    Flutterwave sends webhook to /api/webhooks/flutterwave (TRUSTED)
            |
            v
    Webhook handler verifies signature, verifies transaction via API, marks Order paid
            |
            v
    Admin notified via dashboard + email

The key insight: the browser redirect and the webhook are two different things. The browser redirect is just a UX signal to tell the buyer "we are checking your payment." The webhook is what actually updates the database.

## Environment Variables

Flutterwave needs three keys:

    FLUTTERWAVE_PUBLIC_KEY         Safe to expose. Used in client-side widgets if we ever use them.
    FLUTTERWAVE_SECRET_KEY         Server-only. Used to call the Flutterwave API.
    FLUTTERWAVE_SECRET_HASH        Server-only. Used to verify incoming webhooks.

Get the keys from the Flutterwave dashboard. In development, use test keys. In production, use live keys. The secret hash is something you set yourself in the Flutterwave dashboard under Webhooks; choose a long random string and paste it into both the dashboard and your environment variables.

## Creating a Payment Link

When a buyer hits "Pay Now," we create a pending order and request a payment link from Flutterwave. The Flutterwave endpoint is `https://api.flutterwave.com/v3/payments`. We POST a JSON body:

    {
      "tx_ref": "mesxico_ord_<ORDER_ID>_<RANDOM>",
      "amount": 5000,
      "currency": "NGN",
      "redirect_url": "https://mesxico.com/order/verify?tx_ref=<tx_ref>",
      "customer": {
        "email": "buyer@example.com",
        "name": "Buyer Name"
      },
      "customizations": {
        "title": "Mesxico Cakes and Nuts",
        "description": "Custom Cake & Snacks",
        "logo": "https://mesxico.com/logo.png"
      },
      "meta": {
        "order_id": "<ORDER_ID>"
      }
    }

With the header `Authorization: Bearer ${FLUTTERWAVE_SECRET_KEY}`.

Notes:
- `tx_ref` must be unique per payment attempt. Include the order ID and a random suffix. Save it to the `Order` record before making the request.
- `amount` is in the major unit (naira), not kobo, for this specific Flutterwave endpoint. Convert from your internal kobo representation: `amount: Math.floor(order.amount_kobo / 100)`. This is the one place we go major-unit; everywhere else we stay in kobo. Double-check the conversion.
- `currency` is always `NGN` at launch.
- `meta` fields come back in the webhook, which makes reconciliation easier.
- `redirect_url` includes the `tx_ref` so the success page can show "verifying..." while waiting for the webhook.
- `payment_options`: Set to `"card"` to limit payment methods if needed.
- `expiry`: Optional. Set to a duration like `"1h"` or `"24h"` to expire unused payment links.

The response looks like:

    {
      "status": "success",
      "message": "Hosted Link",
      "data": { "link": "https://checkout.flutterwave.com/v3/hosted/pay/..." }
    }

Return `data.link` to the browser. Redirect the buyer there.

## Verifying a Transaction

After receiving a webhook, call the Flutterwave verify endpoint to confirm the payload is real. Do not trust the webhook body alone, even after signature verification.

    GET https://api.flutterwave.com/v3/transactions/{transaction_id}/verify
    Authorization: Bearer ${FLUTTERWAVE_SECRET_KEY}

The response includes the transaction's real status, amount, currency, and `tx_ref`. Compare them to what you have stored. Only mark the order paid if:

1. `data.status === 'successful'`
2. `data.currency === order.currency` (usually `'NGN'`)
3. `data.amount === Math.floor(order.amount_kobo / 100)` (Flutterwave reports amount in major unit here)
4. `data.tx_ref === order.flutterwave_ref`

If any check fails, log a warning and do not mark the order paid. Respond 200 to the webhook anyway so Flutterwave does not keep retrying a known bad payload.

If the verify API call fails (network error, timeout, 5xx), do not mark the order as paid or failed. Log the error and respond 200 anyway — Flutterwave will retry the webhook and you can verify again on the next attempt.

## Webhook Handling

The webhook handler lives at `app/api/webhooks/flutterwave/route.ts`. See `resources/webhook-handler.ts` in this skill folder for a reference implementation. Copy it into the project and adapt to the current Supabase schema; do not reinvent it.

The handler must:
1. Verify the `verif-hash` header equals `FLUTTERWAVE_SECRET_HASH`. Reject with 401 if not.
2. Parse the payload.
3. Call the verify endpoint with the transaction ID. Wrap this in a retry with exponential backoff (3 attempts, starting at 1s delay).
4. Confirm status, currency, amount, and `tx_ref` against the stored order.
5. Validate `meta` fields (order_id) match the stored order.
6. Update the order status inside an operation that also creates a `payments` record with the `gateway_reference` (Flutterwave's transaction ID).
7. Let the unique constraint on `payments.gateway_reference` catch duplicates. Catch the PostgreSQL `23505` error (unique_violation) and respond 200 without reprocessing.
8. Respond 200 quickly. Heavy work like sending emails goes in a background job, not in the webhook response path.

## Testing

Flutterwave's test mode supports test cards documented at their developer docs. The two you need most often:
- Successful charge: `4187427415564246` (test PIN `3310`, OTP `12345`).
- Failed charge: `5258584131808179`.

Always verify end-to-end with the test keys before shipping any payment-related change. Do not rely on unit tests alone; the bug is almost always in the integration.

### Testing Webhooks Locally

Flutterwave cannot send webhooks to localhost. Use a tunnel to test locally:

1. Install `ngrok` or `localtunnel`.
2. Run your dev server: `npm run dev`.
3. Expose the port: `npx lt --port 3000`.
4. Copy the tunnel URL to the Flutterwave dashboard under Webhooks.
5. Trigger a payment in the browser using test keys.
6. Delete the webhook URL from the dashboard when done.

Make sure to use a test webhook secret hash for development, not the production one.

## Common Mistakes

- Storing amounts as floats. Stay in integer kobo in the database, convert to naira only when calling Flutterwave.
- Trusting the browser redirect. The redirect is not proof of payment.
- Skipping the verify API call. The webhook signature proves the request came from someone who knows the secret hash; calling verify proves the transaction actually exists and succeeded.
- Forgetting idempotency. Flutterwave can retry webhooks. Duplicates must be no-ops.
- Logging the secret key or the webhook body with sensitive fields. Strip before logging.
- Using Paystack patterns. Mesxico is on Flutterwave; ignore anything in old PRDs or references that say Paystack.

## Resources in This Skill

- `resources/webhook-handler.ts` — reference implementation of the webhook route handler. Copy and adapt to current schema.