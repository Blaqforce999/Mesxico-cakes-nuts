export type UserRole = 'admin' | 'customer';

export type ProductCategory = 'cakes' | 'nuts';

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'in_production'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export type DeliveryTimeSlot = 'morning_9_12' | 'afternoon_1_5';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  phone: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  price_kobo: number; // Integer representation of currency
  lead_time_hours: number; // e.g. 48 for cakes, 24 for nuts
  inventory_count: number;
  images: string[];
  is_active: boolean;
  featured: boolean;
  flavor_options?: string[];
  package_size?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price_kobo: number;
  custom_message?: string | null;
  selected_flavor?: string | null;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_date: string; // YYYY-MM-DD
  delivery_time_slot: string; // e.g. "Morning (9:00 AM - 12:00 PM)"
  delivery_notes?: string | null;
  total_amount_kobo: number;
  status: OrderStatus;
  payment_status: PaymentStatus;
  flutterwave_ref: string;
  created_at: string;
  items?: OrderItem[];
}

export interface Payment {
  id: string;
  order_id: string;
  gateway: 'flutterwave';
  gateway_reference: string;
  amount_kobo: number;
  currency: 'NGN';
  status: string;
  raw_payload?: Record<string, unknown> | null;
  created_at: string;
}
