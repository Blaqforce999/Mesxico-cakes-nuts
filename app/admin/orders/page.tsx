'use client';

import React, { useState } from 'react';
import {
  ChefHat,
  Calendar,
  Clock,
  MapPin,
  Phone,
  Search,
  CheckCircle,
  Truck,
  Filter,
  Flame,
  Package,
} from 'lucide-react';
import { formatNaira, formatDisplayDate } from '@/lib/utils';
import { OrderStatus } from '@/types/database';
import { Badge } from '@/components/ui/Badge';

// Initial mock orders demonstrating real kitchen workflow
const INITIAL_ADMIN_ORDERS = [
  {
    id: 'ord-101',
    order_number: 'MESX-K8P9',
    customer_name: 'Amina Yusuf',
    customer_email: 'amina.yusuf@example.com',
    customer_phone: '08034567890',
    delivery_address: 'Flat 4B, Admiralty Towers, Lekki Phase 1, Lagos',
    delivery_date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days ahead
    delivery_time_slot: 'Morning (9:00 AM - 12:00 PM)',
    delivery_notes: 'Ring bell twice, gate pass code: 4492',
    total_amount_kobo: 3050000, // ₦30,500 (₦28k cake + ₦2.5k delivery)
    status: 'paid' as OrderStatus,
    payment_status: 'paid',
    items: [
      {
        product_name: 'Artisanal Celebration Heart Cake',
        quantity: 1,
        unit_price_kobo: 2800000,
        selected_flavor: 'Rich Red Velvet',
        custom_message: 'Happy 30th Birthday Amina! Queen of Hearts 👑',
      },
    ],
  },
  {
    id: 'ord-102',
    order_number: 'MESX-L2Q4',
    customer_name: 'Emeka Okonkwo',
    customer_email: 'emeka.o@example.com',
    customer_phone: '08123456789',
    delivery_address: '15 Isaac John Street, GRA Ikeja, Lagos',
    delivery_date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    delivery_time_slot: 'Afternoon (1:00 PM - 5:00 PM)',
    delivery_notes: 'Office reception desk',
    total_amount_kobo: 1500000, // ₦15,000
    status: 'in_production' as OrderStatus,
    payment_status: 'paid',
    items: [
      {
        product_name: 'Premium Oven-Roasted Jumbo Cashews (1kg Bulk Pouch)',
        quantity: 1,
        unit_price_kobo: 1250000,
        selected_flavor: 'Lightly Salted',
        custom_message: null,
      },
    ],
  },
  {
    id: 'ord-103',
    order_number: 'MESX-M9R1',
    customer_name: 'Dr. Kelechi Nwosu',
    customer_email: 'knwosu@hospital.org',
    customer_phone: '09087654321',
    delivery_address: 'St. Nicholas Clinic, Victoria Island, Lagos',
    delivery_date: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    delivery_time_slot: 'Morning (9:00 AM - 12:00 PM)',
    delivery_notes: 'Deliver to doctors lounge on 3rd floor',
    total_amount_kobo: 1650000, // ₦16,500
    status: 'paid' as OrderStatus,
    payment_status: 'paid',
    items: [
      {
        product_name: 'Deluxe Swirled Cupcake Gift Box (12 pcs)',
        quantity: 1,
        unit_price_kobo: 1400000,
        selected_flavor: 'Red Velvet & Cream Cheese',
        custom_message: 'Congratulations Dr. Kelechi on your promotion!',
      },
    ],
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ADMIN_ORDERS);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === 'all' || order.status === statusFilter;
    const matchesSearch =
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery_address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary">Paid • Ready for Prep</Badge>;
      case 'in_production':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Flame className="w-3 h-3 mr-1" />
            In The Oven / Baking
          </span>
        );
      case 'out_for_delivery':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-900 border border-blue-300">
            <Truck className="w-3 h-3 mr-1" />
            Out For Delivery
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-900 border border-green-300">
            <CheckCircle className="w-3 h-3 mr-1" />
            Delivered
          </span>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-[27px] leading-[1.2] text-on-surface">
            Baking Schedule &amp; Order Fulfillment
          </h1>
          <p className="text-sm text-on-surface-variant">
            Track daily cake baking queue, customized inscriptions, and delivery dispatches.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-surface border border-outline-variant px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] uppercase font-bold text-outline block">Total Active Orders</span>
            <span className="font-display font-bold text-[19px] leading-[1.4] text-primary">{orders.length}</span>
          </div>
          <div className="bg-surface border border-outline-variant px-4 py-2 rounded-xl text-center">
            <span className="text-[11px] uppercase font-bold text-outline block">Revenue (kobo)</span>
            <span className="font-body font-bold text-xl text-secondary">
              {formatNaira(orders.reduce((acc, o) => acc + o.total_amount_kobo, 0))}
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-surface rounded-2xl border border-outline-variant/60 p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-outline absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, order # or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full min-h-[40px] pl-9.5 pr-4 py-2 rounded-lg border border-outline-variant bg-surface text-sm font-body focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <span className="text-xs text-outline flex items-center mr-1">
            <Filter className="w-3.5 h-3.5 mr-1" />
            Filter:
          </span>
          {['all', 'paid', 'in_production', 'out_for_delivery', 'delivered'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`min-h-[36px] px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === st
                  ? 'bg-primary text-on-primary font-semibold'
                  : 'bg-surface-variant/40 text-on-surface hover:bg-surface-variant'
              }`}
            >
              {st === 'all'
                ? 'All Orders'
                : st === 'in_production'
                ? 'In The Oven'
                : st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Cards Grid */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-surface rounded-2xl border border-outline-variant space-y-2">
            <Package className="w-12 h-12 text-outline mx-auto" />
            <h3 className="font-body font-semibold text-lg text-on-surface">
              No orders match your criteria
            </h3>
            <p className="text-xs text-on-surface-variant">
              Try adjusting the filter or search query.
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-surface rounded-2xl border border-outline-variant/70 p-6 space-y-5 shadow-sm hover:border-outline transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-outline-variant/40 gap-3">
                <div className="flex items-center space-x-3">
                  <span className="font-display font-bold text-[19px] leading-[1.4] text-primary">
                    {order.order_number}
                  </span>
                  {getStatusBadge(order.status)}
                </div>

                <div className="flex items-center space-x-4 text-xs text-on-surface-variant">
                  <div className="flex items-center space-x-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span className="font-bold text-on-surface">
                      Fulfillment: {formatDisplayDate(order.delivery_date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-4 h-4 text-secondary" />
                    <span>{order.delivery_time_slot}</span>
                  </div>
                </div>
              </div>

              {/* Order Body */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left: Items and Custom Cake Notes */}
                <div className="md:col-span-7 space-y-3">
                  <h4 className="font-body text-xs uppercase font-bold text-outline tracking-wider">
                    Kitchen Bake Sheet Items
                  </h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-surface-variant/20 border border-outline-variant/40 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-body font-semibold text-base text-on-surface">
                            {item.quantity}x {item.product_name}
                          </span>
                          <span className="text-xs font-bold text-primary">
                            {formatNaira(item.unit_price_kobo * item.quantity)}
                          </span>
                        </div>
                        {item.selected_flavor && (
                          <p className="text-xs text-on-surface-variant">
                            Selected Flavor: <strong>{item.selected_flavor}</strong>
                          </p>
                        )}
                        {item.custom_message && (
                          <div className="p-2.5 rounded-lg bg-primary-container/40 border border-primary/20 text-xs text-on-primary-container font-semibold">
                            🎂 Decorator Inscription: &quot;{item.custom_message}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Customer & Delivery Info */}
                <div className="md:col-span-5 space-y-3">
                  <h4 className="font-body text-xs uppercase font-bold text-outline tracking-wider">
                    Customer &amp; Dispatch Details
                  </h4>
                  <div className="text-sm space-y-2 text-on-surface">
                    <p className="font-bold">{order.customer_name}</p>
                    <p className="flex items-center space-x-2 text-xs text-on-surface-variant">
                      <Phone className="w-3.5 h-3.5 text-primary" />
                      <a href={`tel:${order.customer_phone}`} className="hover:underline">
                        {order.customer_phone}
                      </a>
                    </p>
                    <p className="flex items-start space-x-2 text-xs text-on-surface-variant">
                      <MapPin className="w-3.5 h-3.5 text-secondary shrink-0 mt-0.5" />
                      <span>{order.delivery_address}</span>
                    </p>
                    {order.delivery_notes && (
                      <p className="text-xs bg-surface-variant/40 p-2 rounded-lg text-outline italic">
                        Note: {order.delivery_notes}
                      </p>
                    )}
                    <p className="pt-2 text-sm font-semibold">
                      Total Paid:{' '}
                      <span className="text-primary font-bold">
                        {formatNaira(order.total_amount_kobo)}
                      </span>{' '}
                      <span className="text-xs text-outline font-normal">
                        ({order.total_amount_kobo} kobo)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-outline-variant/40 flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-outline font-medium">
                  Update Fulfillment Progress:
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleStatusChange(order.id, 'in_production')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-all ${
                      order.status === 'in_production'
                        ? 'bg-amber-600 text-white shadow-xs'
                        : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    🔥 In The Oven
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(order.id, 'out_for_delivery')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-all ${
                      order.status === 'out_for_delivery'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    🚚 Out For Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(order.id, 'delivered')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold min-h-[36px] transition-all ${
                      order.status === 'delivered'
                        ? 'bg-green-600 text-white shadow-xs'
                        : 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-variant'
                    }`}
                  >
                    ✅ Delivered
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
