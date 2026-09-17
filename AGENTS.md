# Mesxico Cakes and Nuts — Agent Project Brief

## What This Product Is
Mesxico Cakes and Nuts is a direct-to-consumer (D2C) e-commerce web platform for ordering freshly baked custom cakes and premium packaged nuts. It replaces manual social media DM sales with an automated, mobile-first storefront featuring date-specific delivery scheduling, live cart handling, and automated checkout via Flutterwave.

**Core Promise:** Order celebration cakes and artisanal nuts in under two minutes with automated date fulfillment and verified payments.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (Strict Mode) |
| Database & Auth | Supabase (PostgreSQL, Supabase Auth, Row Level Security) |
| Storage | Supabase Storage (Product imagery) |
| Payment Gateway | Flutterwave Standard Checkout API |
| Styling | Tailwind CSS + CSS Custom Properties (Design Tokens) |
| Validation | Zod |
| Email Dispatch | Resend / Transactional API |

---

## Directory Layout

    mesxico/
    ├── .agents/
    │   └── rules/
    │       ├── architecture.md
    │       ├── code-style.md
    │       ├── design-system.md
    │       └── security.md
    ├── app/
    │   ├── (storefront)/
    │   │   ├── page.tsx                    # Landing page & featured catalog
    │   │   ├── cakes/page.tsx              # Cake category listing
    │   │   ├── nuts/page.tsx               # Nuts category listing
    │   │   └── product/[slug]/page.tsx     # Dynamic product detail
    │   ├── (checkout)/
    │   │   ├── cart/page.tsx               # Cart review & date-time scheduling
    │   │   └── order/verify/page.tsx       # Untrusted post-redirect display
    │   ├── (admin)/
    │   │   ├── layout.tsx                  # Admin authenticated layout 
    │   │   ├── orders/page.tsx             # Order fulfillment management
    │   │   └── inventory/page.tsx          # Stock and catalog management
    │   └── api/
    │       ├── checkout/route.ts           # Order initialization 
    │       └── webhooks/
    │           └── flutterwave/route.ts    # Trusted payment handler 
    ├── components/
    │   ├── ui/                             # Buttons, inputs, modals, cards
    │   ├── storefront/                     # Product cards, category filters
    │   ├── checkout/                       # Date selector, cart drawer
    │   └── shared/                         # Navbar, footer, notifications
    ├── lib/
    │   ├── supabase/
    │   │   ├── client.ts                   # Client-side Supabase client
    │   │   ├── server.ts                   # Server-side Supabase client
    │   │   └── admin.ts                    # Service-role Supabase client
    │   ├── flutterwave.ts                  # Flutterwave API helper 
    │   ├── env.ts                          # Zod-validated environment config
    │   └── utils.ts                        # Currency, date formatting
    ├── skills/                             # Agent domain execution packages
    ├── workflows/                          # Feature scaffolding runbooks
    └── types/                              # Supabase database types 

---

## Critical Business Rules

1. **Money Representation:** All prices are strictly managed and stored in **kobo as integers**. Only divide by 100 at the presentation layer for display in Naira (₦).
2. **Order Lead Times:** Custom cakes require a minimum 48-hour delivery window. Packaged nuts allow next-day delivery. The cart date-picker enforces the maximum lead time among all cart items.
3. **Untrusted Client Redirects:** The browser redirect page (`/order/verify`) is an informational display only. An order is never marked as `paid` until the server webhook executes and verifies the transaction.