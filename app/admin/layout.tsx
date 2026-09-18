import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChefHat, ShoppingBag, Layers, ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Kitchen & Order Fulfillment | Mesxico Admin',
  description: 'Manage daily baking schedules, delivery fulfillment, and product stock.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-variant/20 flex flex-col font-body">
      {/* Admin Top Navigation */}
      <header className="bg-surface border-b border-outline-variant sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-outline hover:text-primary transition-colors text-xs font-medium">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Storefront</span>
              </Link>
              <div className="h-5 w-px bg-outline-variant" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-primary-container p-0.5">
                  <Image
                    src="/logo.png"
                    alt="Mesxico Logo"
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <span className="font-body font-bold text-lg text-on-surface">
                  Kitchen Fulfillment Admin
                </span>
                <span className="inline-flex items-center space-x-1 bg-secondary-container text-on-secondary-container text-[11px] font-bold px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  <span>Admin RLS Protected</span>
                </span>
              </div>
            </div>

            <nav className="flex items-center space-x-2 sm:space-x-4">
              <Link
                href="/admin/orders"
                className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-primary bg-primary-container/60 hover:bg-primary-container min-h-[36px] flex items-center space-x-1.5 transition-colors"
              >
                <ChefHat className="w-4 h-4" />
                <span>Bake Sheet &amp; Orders</span>
              </Link>
              <Link
                href="/admin/inventory"
                className="px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold text-on-surface hover:bg-surface-variant min-h-[36px] flex items-center space-x-1.5 transition-colors"
              >
                <Layers className="w-4 h-4" />
                <span>Inventory &amp; Stock</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
