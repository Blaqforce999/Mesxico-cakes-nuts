'use client';

import { create } from 'zustand';
import { Product } from '@/types/database';

interface ModalState {
  // Product Detail Modal
  selectedProduct: Product | null;
  isProductModalOpen: boolean;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  // Auth Modal (Sign In / Sign Up)
  isAuthModalOpen: boolean;
  authModalMode: 'signin' | 'signup';
  openAuthModal: (mode?: 'signin' | 'signup') => void;
  closeAuthModal: () => void;
  setAuthModalMode: (mode: 'signin' | 'signup') => void;
}

export const useModalStore = create<ModalState>((set) => ({
  // Product Detail Modal
  selectedProduct: null,
  isProductModalOpen: false,
  openProductModal: (product: Product) => {
    set({ selectedProduct: product, isProductModalOpen: true });
    // Update URL shallowly for SPA continuation feeling without reload
    if (typeof window !== 'undefined') {
      window.history.pushState({ modal: true, slug: product.slug }, '', `/product/${product.slug}`);
    }
  },
  closeProductModal: () => {
    set({ isProductModalOpen: false, selectedProduct: null });
    // Restore URL back to root or current section
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/product/')) {
      window.history.pushState(null, '', '/');
    }
  },

  // Auth Modal
  isAuthModalOpen: false,
  authModalMode: 'signin',
  openAuthModal: (mode = 'signin') => {
    set({ isAuthModalOpen: true, authModalMode: mode });
  },
  closeAuthModal: () => {
    set({ isAuthModalOpen: false });
  },
  setAuthModalMode: (mode: 'signin' | 'signup') => {
    set({ authModalMode: mode });
  },
}));
