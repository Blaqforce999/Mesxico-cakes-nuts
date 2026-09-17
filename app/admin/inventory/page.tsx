'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Layers, Plus, Minus, Check, X, Clock, AlertTriangle } from 'lucide-react';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-catalog';
import { Product } from '@/types/database';
import { formatNaira } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [filterCategory, setFilterCategory] = useState<'all' | 'cakes' | 'nuts'>('all');

  const handleToggleActive = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, is_active: !p.is_active } : p))
    );
  };

  const handleStockChange = (productId: string, delta: number) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, inventory_count: Math.max(0, p.inventory_count + delta) }
          : p
      )
    );
  };

  const filteredProducts = products.filter(
    (p) => filterCategory === 'all' || p.category === filterCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-bold text-3xl text-on-surface">
            Catalog &amp; Inventory Management
          </h1>
          <p className="text-sm text-on-surface-variant">
            Manage product availability, stock counts, and lead-time constraints.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center space-x-2 bg-surface p-1 rounded-xl border border-outline-variant">
          {(['all', 'cakes', 'nuts'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-primary text-on-primary shadow-xs'
                  : 'text-on-surface hover:bg-surface-variant'
              }`}
            >
              {cat === 'all' ? 'All Items' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant/70 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body">
            <thead className="bg-surface-variant/30 text-xs uppercase font-bold text-outline border-b border-outline-variant/50">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price (Kobo &amp; ₦)</th>
                <th className="py-3.5 px-4">Lead Time</th>
                <th className="py-3.5 px-4">Stock Units</th>
                <th className="py-3.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-surface-variant/10 transition-colors">
                  {/* Product Info */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center space-x-3.5">
                      <div className="relative w-12 h-12 rounded-lg bg-surface-variant/40 overflow-hidden shrink-0 border border-outline-variant/40">
                        <Image
                          src={product.images[0] || '/products/cupcake_single.jpeg'}
                          alt={product.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-semibold text-on-surface line-clamp-1">
                          {product.name}
                        </p>
                        <p className="text-xs text-outline">{product.package_size || 'Standard pack'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4">
                    <span className="capitalize text-xs font-semibold text-on-surface">
                      {product.category}
                    </span>
                  </td>

                  {/* Price */}
                  <td className="py-4 px-4">
                    <div>
                      <span className="font-bold text-primary block">
                        {formatNaira(product.price_kobo)}
                      </span>
                      <span className="text-[11px] text-outline font-mono block">
                        {product.price_kobo.toLocaleString()} kobo
                      </span>
                    </div>
                  </td>

                  {/* Lead Time */}
                  <td className="py-4 px-4">
                    <Badge variant={product.lead_time_hours >= 48 ? 'leadTime' : 'secondary'}>
                      <Clock className="w-3 h-3 mr-1 inline" />
                      {product.lead_time_hours}h
                    </Badge>
                  </td>

                  {/* Stock Quantity Controls */}
                  <td className="py-4 px-4">
                    <div className="flex items-center space-x-2 border border-outline-variant rounded-lg bg-surface px-2 py-1 w-fit">
                      <button
                        type="button"
                        onClick={() => handleStockChange(product.id, -5)}
                        className="p-1 hover:text-primary transition-colors text-outline"
                        aria-label="Decrease stock by 5"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-semibold text-xs text-on-surface w-8 text-center">
                        {product.inventory_count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleStockChange(product.id, 5)}
                        className="p-1 hover:text-primary transition-colors text-outline"
                        aria-label="Increase stock by 5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Active Toggle */}
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(product.id)}
                      className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all min-h-[32px] ${
                        product.is_active
                          ? 'bg-green-100 text-green-900 border border-green-300'
                          : 'bg-red-100 text-red-900 border border-red-300'
                      }`}
                    >
                      {product.is_active ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Active / In Stock</span>
                        </>
                      ) : (
                        <>
                          <X className="w-3.5 h-3.5" />
                          <span>Sold Out / Inactive</span>
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
