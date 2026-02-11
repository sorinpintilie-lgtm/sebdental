"use client";

import { create } from "zustand";

interface CompareStore {
  ids: string[];
  toggle: (productId: string) => void;
  clear: () => void;
}

export const useCompareStore = create<CompareStore>((set) => ({
  ids: [],
  toggle: (productId) =>
    set((state) => {
      const exists = state.ids.includes(productId);
      if (exists) return { ids: state.ids.filter((id) => id !== productId) };
      if (state.ids.length >= 4) return state;
      return { ids: [...state.ids, productId] };
    }),
  clear: () => set({ ids: [] }),
}));

