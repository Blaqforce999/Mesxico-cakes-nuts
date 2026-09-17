'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/database';

export interface CartItem {
  product: Product;
  quantity: number;
  customMessage?: string;
  selectedFlavor?: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, quantity?: number, customMessage?: string, selectedFlavor?: string) => void;
  removeItem: (productId: string, customMessage?: string, selectedFlavor?: string) => void;
  updateQuantity: (productId: string, quantity: number, customMessage?: string, selectedFlavor?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getItemCount: () => number;
  getTotalKobo: () => number;
  getLeadTimeHours: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, customMessage, selectedFlavor) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.product.id === product.id &&
              item.customMessage === customMessage &&
              item.selectedFlavor === selectedFlavor
          );

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += quantity;
            return { items: updatedItems, isOpen: true };
          }

          return {
            items: [...state.items, { product, quantity, customMessage, selectedFlavor }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId, customMessage, selectedFlavor) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product.id === productId &&
                item.customMessage === customMessage &&
                item.selectedFlavor === selectedFlavor
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, customMessage, selectedFlavor) => {
        if (quantity <= 0) {
          get().removeItem(productId, customMessage, selectedFlavor);
          return;
        }

        set((state) => ({
          items: state.items.map((item) => {
            if (
              item.product.id === productId &&
              item.customMessage === customMessage &&
              item.selectedFlavor === selectedFlavor
            ) {
              return { ...item, quantity };
            }
            return item;
          }),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalKobo: () => {
        return get().items.reduce(
          (total, item) => total + item.quantity * item.product.price_kobo,
          0
        );
      },

      getLeadTimeHours: () => {
        const items = get().items;
        if (items.length === 0) return 24;
        return Math.max(...items.map((item) => item.product.lead_time_hours || 24));
      },
    }),
    {
      name: 'mesxico_cart_storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
