"use client";

import { create } from "zustand";

interface SavedList {
  id: string;
  name: string;
  items: string[];
}

interface SavedListsStore {
  lists: SavedList[];
  createList: (name: string) => void;
  renameList: (id: string, name: string) => void;
  addToList: (id: string, productId: string) => void;
  removeFromList: (id: string, productId: string) => void;
}

export const useSavedListsStore = create<SavedListsStore>((set) => ({
  lists: [
    { id: "l1", name: "Endo", items: [] },
    { id: "l2", name: "Zirconiu", items: [] },
    { id: "l3", name: "Finisare", items: [] },
    { id: "l4", name: "Cabinet 2", items: [] },
  ],
  createList: (name) => set((state) => ({ lists: [...state.lists, { id: crypto.randomUUID(), name, items: [] }] })),
  renameList: (id, name) => set((state) => ({ lists: state.lists.map((l) => (l.id === id ? { ...l, name } : l)) })),
  addToList: (id, productId) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === id && !l.items.includes(productId) ? { ...l, items: [...l.items, productId] } : l)),
    })),
  removeFromList: (id, productId) =>
    set((state) => ({
      lists: state.lists.map((l) => (l.id === id ? { ...l, items: l.items.filter((p) => p !== productId) } : l)),
    })),
}));

