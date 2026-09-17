---
trigger: always_on
---

# Architecture Rules

These rules dictate the architectural structure of Mesxico Cakes and Nuts. Every agent building features must strictly follow this pattern.

## The Architecture
Mesxico is a monolithic Next.js App Router application built in strict TypeScript. Supabase handles PostgreSQL storage, user authentication, and object assets. Flutterwave handles hosted payment checkout. There is no separate backend service; all business logic resides in Next.js Server Components, Server Actions, and Route Handlers.

## Rendering Strategy
- **Public Product Pages (`/product/[slug]`):** Must be React Server Components (RSC) to guarantee SEO indexing, fast initial paint, and OpenGraph metadata generation.
- **Cart & Customization Components:** Must use Client Components (`"use client"`) scoped to interactive boundaries.
- **Admin Views:** Server components for initial data hydration, with client-side interactive tables for instant status toggling.

## Data Flow & State Transitions
1. **Catalog Browsing:** Fetched directly from Supabase via Server Components using `@supabase/ssr`.
2. **Cart Management:** Stored in client-side state (Zustand or React Context) synchronized with `localStorage`.
3. **Order Initialization:** Form submission calls `/api/checkout`, validating the cart via Zod, creating a `pending` order in Supabase, and requesting a hosted checkout URL from Flutterwave.
4. **Order Confirmation:** Handled solely by `/api/webhooks/flutterwave`. This endpoint validates signatures, verifies the transaction with the Flutterwave API, and updates order states within an atomic operation.

## What Not to Do
- Do not introduce alternative ORMs (e.g., Prisma, Drizzle); use the direct Supabase JavaScript client with generated database types.
- Do not make client-side calls to Supabase using the `service_role` key under any circumstances.
- Do not store monetary values as decimal floats.
- Do not fetch API routes from inside Server Components; query Supabase directly on the server.