---
trigger: always_on
---

# Architecture Rules

These rules dictate the architectural structure of Mesxico Cakes and Nuts. Every agent building features must strictly follow this pattern.

## The Architecture
Mesxico is a monolithic Next.js App Router application built in strict TypeScript. The product catalog is a static in-memory dataset (`lib/data/mock-catalog.ts`) — there is no external database. Flutterwave handles hosted payment checkout. There is no separate backend service; all business logic resides in Next.js Server Components, Server Actions, and Route Handlers.

## Rendering Strategy
- **Public Product Pages (`/product/[slug]`):** Must be React Server Components (RSC) to guarantee SEO indexing, fast initial paint, and OpenGraph metadata generation.
- **Cart & Customization Components:** Must use Client Components (`"use client"`) scoped to interactive boundaries.
- **Admin Views:** Server components for initial data hydration, with client-side interactive tables for instant status toggling.

## Data Flow & State Transitions
1. **Catalog Browsing:** Read directly from the static catalog in `lib/products.ts` / `lib/data/mock-catalog.ts` via Server Components.
2. **Cart Management:** Stored in client-side state (Zustand) synchronized with `localStorage`.
3. **Order Initialization:** Form submission calls `/api/checkout`, validating the cart via Zod against the static catalog, then requesting a hosted checkout URL from Flutterwave. Orders are not persisted server-side.
4. **Order Confirmation:** Handled by `/api/webhooks/flutterwave`, which validates signatures and verifies the transaction with the Flutterwave API.

## What Not to Do
- Do not introduce a database or ORM (e.g., Supabase, Prisma, Drizzle) without an explicit request — the app is intentionally static-data only.
- Do not store monetary values as decimal floats.
- Do not fetch API routes from inside Server Components; read the catalog module directly on the server.
