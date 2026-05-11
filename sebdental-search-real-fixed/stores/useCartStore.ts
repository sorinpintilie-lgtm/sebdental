"use client";

import { create } from "zustand";

interface CartItem {
  productId: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  add: (productId: string, qty?: number) => void;
  remove: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  open: () => void;
  close: () => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>((set) => ({
  items: [],
  isOpen: false,
  add: (productId, qty = 1) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === productId);
      const items = existing
        ? state.items.map((i) => (i.productId === productId ? { ...i, qty: i.qty + qty } : i))
        : [...state.items, { productId, qty }];
      return { items, isOpen: true };
    }),
  remove: (productId) => set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  setQty: (productId, qty) =>
    set((state) => ({
      items: state.items.map((i) => (i.productId === productId ? { ...i, qty: Math.max(1, qty) } : i)),
    })),
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  clear: () => set({ items: [] }),
}));

