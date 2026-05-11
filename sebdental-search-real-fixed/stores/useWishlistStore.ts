"use client";

import { create } from "zustand";

interface WishlistStore {
  ids: string[];
  toggle: (productId: string) => void;
}

export const useWishlistStore = create<WishlistStore>((set) => ({
  ids: [],
  toggle: (productId) =>
    set((state) => ({
      ids: state.ids.includes(productId)
        ? state.ids.filter((id) => id !== productId)
        : [...state.ids, productId],
    })),
}));

