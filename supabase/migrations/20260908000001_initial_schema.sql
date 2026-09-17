-- Initial schema for Mesxico Cakes and Nuts
-- Managed via Supabase migrations

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. PROFILES & ROLES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 2. PRODUCTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('cakes', 'nuts')),
  price_kobo INTEGER NOT NULL CHECK (price_kobo >= 0),
  lead_time_hours INTEGER NOT NULL DEFAULT 48,
  inventory_count INTEGER NOT NULL DEFAULT 100,
  images TEXT[] NOT NULL DEFAULT '{}',
  flavor_options TEXT[] DEFAULT '{}',
  package_size TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 3. ORDERS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_date DATE NOT NULL,
  delivery_time_slot TEXT NOT NULL,
  delivery_notes TEXT,
  total_amount_kobo INTEGER NOT NULL CHECK (total_amount_kobo >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'in_production', 'out_for_delivery', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'refunded')),
  flutterwave_ref TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 4. ORDER ITEMS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_kobo INTEGER NOT NULL CHECK (unit_price_kobo >= 0),
  custom_message TEXT,
  selected_flavor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 5. PAYMENTS (AUDIT & IDEMPOTENCY)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  gateway TEXT NOT NULL DEFAULT 'flutterwave',
  gateway_reference TEXT UNIQUE NOT NULL, -- Flutterwave tx ID ensures idempotency
  amount_kobo INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  status TEXT NOT NULL,
  raw_payload JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- 6. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_orders_delivery_date ON public.orders(delivery_date);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_ref ON public.payments(gateway_reference);

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if current auth user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can view and edit their own profile; admins can view all
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Products: Anyone can view active products; Admins can do anything
CREATE POLICY "Public can view active products"
  ON public.products FOR SELECT
  USING (is_active = TRUE OR public.is_admin());

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.is_admin());

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.is_admin());

-- Orders: Public can insert pending orders during checkout; Admins can manage all
CREATE POLICY "Public can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view orders"
  ON public.orders FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (public.is_admin());

-- Order Items: Public can insert items with orders; Admins can view
CREATE POLICY "Public can insert order items"
  ON public.order_items FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "Admins can view order items"
  ON public.order_items FOR SELECT
  USING (public.is_admin());

-- Payments: Only Admins or service_role can view payment records
CREATE POLICY "Admins can view payments"
  ON public.payments FOR SELECT
  USING (public.is_admin());
