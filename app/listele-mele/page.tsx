"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useSavedListsStore } from "@/stores/useSavedListsStore";
import { useCartStore } from "@/stores/useCartStore";

export default function ListeleMelePage() {
  const { lists, createList, renameList, removeFromList } = useSavedListsStore();
  const add = useCartStore((s) => s.add);
  const [name, setName] = useState("");

  return (
    <section className="space-y-6">
      <h1 className="text-3xl">Tăvile mele</h1>
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nume listă" className="rounded-xl border border-fg/15 bg-white px-3 py-2" />
        <button className="rounded-xl bg-primary px-4 py-2 text-white" onClick={() => { if (name.trim()) createList(name.trim()); setName(""); }}>Creează</button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lists.map((list) => (
          <div key={list.id} className="surface rounded-2xl p-5">
            <input className="mb-3 w-full rounded border border-fg/15 px-2 py-1 font-medium" value={list.name} onChange={(e) => renameList(list.id, e.target.value)} />
            <div className="space-y-2 text-sm">
              {list.items.length === 0 ? <p className="text-fg/60">Lista este goală.</p> : list.items.map((id) => {
                const product = products.find((p) => p.id === id);
                if (!product) return null;
                return (
                  <div key={id} className="flex items-center justify-between">
                    <span>{product.name}</span>
                    <button className="text-copper" onClick={() => removeFromList(list.id, id)}>Șterge</button>
                  </div>
                );
              })}
            </div>
            <button className="mt-4 rounded-lg border border-fg/15 px-3 py-1 text-sm" onClick={() => list.items.forEach((id) => add(id))}>Adaugă tot în coș</button>
          </div>
        ))}
      </div>
    </section>
  );
}

