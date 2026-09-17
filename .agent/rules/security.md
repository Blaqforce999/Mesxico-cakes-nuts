---
trigger: always_on
---

# Security Rules

Mesxico Cakes and Nuts handles money. Customers trust us to move their payments safely. A security mistake here is not a bug, it is a breach of that trust. Every agent working on this codebase must follow these rules without exception.

## Secrets and Configuration

Never commit secrets to the repository. API keys, database URLs, webhook secrets, and signing keys live in environment variables, loaded through a validated config module.

The required environment variables are:

    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    FLUTTERWAVE_PUBLIC_KEY
    FLUTTERWAVE_SECRET_KEY
    FLUTTERWAVE_SECRET_HASH       (for webhook verification)
    NEXT_PUBLIC_APP_URL

Environment variables are validated at boot with zod in `lib/env.ts`. If a required variable is missing, the app refuses to start rather than running in a half-configured state.

Only variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put a secret behind that prefix, even if you think it looks harmless.

## Authentication & Authorization

Authentication is handled via Supabase Auth. Passwords are encrypted securely by Supabase before hitting the database. Never log passwords, even during debugging.

Sessions are cookie-based. Cookies must have:
- `httpOnly: true`
- `secure: true` in production
- `sameSite: 'lax'`

Logout invalidates the session on the server side by deleting the session record, not just the cookie. A stolen cookie is useless if the server no longer recognizes its token. Row Level Security (RLS) must be enabled on every Supabase table to enforce authorization at the database level.

## Input Validation

Every piece of data that enters the application from outside must be validated with zod before it touches the database or any business logic. This applies to:
- Form submissions (e.g., cart checkout, custom cake notes)
- Route handler request bodies
- URL parameters and query strings
- Webhook payloads

Validation is not optional and is not the frontend's job. The frontend can validate for user experience, but the server validates for safety.

## Database Injection Defense

All database access goes through the Supabase JavaScript client, which leverages PostgREST and parameterized queries to prevent SQL injection by default. Never bypass this by string-concatenating raw SQL in Edge Functions or database migrations. 

## Cross-Site Scripting (XSS)

React escapes strings by default when rendering, which handles most cases. The main risks are:
- `dangerouslySetInnerHTML`: do not use it unless content has been sanitized server-side with a library like DOMPurify, and even then, only for content you control.
- User-submitted URLs: never put an unvalidated URL in an `href` or `src`. Validate that it starts with `https://` and, where relevant, that it points to an allowed domain.

## Cross-Site Request Forgery (CSRF)

Server actions in Next.js include built-in CSRF protection. Route handlers that perform state-changing operations must verify the origin of the request:
- Check the `Origin` or `Referer` header matches the app's domain.
- For authenticated endpoints, rely on the `sameSite: 'lax'` cookie attribute plus origin checking.

The Flutterwave webhook endpoint is an exception because it comes from Flutterwave, not the browser. It is verified with the webhook secret hash.

## Payments (Flutterwave)

This section is the most important in this file. Read it twice.

**Server-side verification is mandatory.** Never trust the browser when it says a payment succeeded. The flow is:
1. Buyer clicks "Pay Now." The server creates a pending `Order` and returns a Flutterwave hosted checkout URL.
2. Buyer completes payment on Flutterwave's page.
3. Flutterwave redirects the buyer back to our success page. This redirect is a hint, not proof. Show a "verifying payment..." state; do not mark the order paid yet.
4. Flutterwave sends a webhook to `app/api/webhooks/flutterwave/route.ts` with the full transaction details.
5. The webhook handler:
   - Verifies the `verif-hash` header matches `FLUTTERWAVE_SECRET_HASH`. If it does not match, reject with 401.
   - Calls the Flutterwave "verify transaction" API with the transaction ID to confirm the payload, because webhook payloads can technically be spoofed if the secret ever leaks.
   - Confirms the returned status is `successful`, the currency matches, and the amount matches the `Order.amount` exactly.
   - Updates the order status to `paid` inside a database transaction.
   - Triggers the admin/customer notification (dashboard update, email).

**Idempotency is mandatory.** Flutterwave can deliver the same webhook more than once. The `Payment.gatewayReference` column has a unique constraint. If the handler tries to insert a duplicate, catch the unique violation and respond 200 without reprocessing. Do not mark the order paid twice, do not send two emails, do not notify the admin twice.

**Never expose the secret key to the browser.** The public key is safe to expose. The secret key and the webhook hash must only appear in server-side code.

**Amount handling.** Store amounts as integers (kobo, the smallest unit of the naira, where 1 NGN = 100 kobo). Never use floating point for money. The database `BIGINT` or `INTEGER` columns are correct; `Float` is not.

## File Uploads

Product images are uploaded by the admin, or reference images by customers. They are untrusted input.

- Accept only `image/jpeg`, `image/png`, and `image/webp` based on the actual file bytes, not the client-provided MIME type.
- Enforce a maximum file size (5MB is a reasonable default).
- Store files in Supabase Storage with a random filename. Never use the client's filename directly.
- Serve uploaded images from the storage provider's domain or a CDN, never from the same origin as the app.

## Rate Limiting

Apply rate limits to:
- Login attempts (to slow down credential stuffing)
- Order creation on the checkout page (to slow down card testing attacks)

Use an in-memory limiter for development and a Redis-backed one for production (or Supabase built-in rate limits where applicable).

## Logging

Log enough context to debug an incident, never enough to leak user data.

- Log request method, path, status, duration, and a request ID.
- Log user ID (not email, not name) when relevant.
- Log error stacks on the server.
- Never log: passwords, session tokens, full card numbers, CVVs, Flutterwave secret keys, webhook secrets, buyer email unless required for incident response.

## Dependencies

Every dependency is a potential vulnerability. Keep the list small. Run `npm audit` regularly. When a vulnerability is reported, update the package within a week unless the vulnerability does not affect our use case.

Do not install packages with fewer than a few thousand weekly downloads or no recent commits unless the developer approves.

## Incident Response

If a secret is exposed (committed by accident, leaked in a log, shared in a screenshot), rotate it immediately. The order is:
1. Rotate the secret at the provider (Flutterwave, Supabase).
2. Update the environment variable in production.
3. Deploy.
4. Revoke the old secret.
5. Tell the developer what happened and when, in writing.

Do not try to hide a leak. Fast, honest response limits damage.