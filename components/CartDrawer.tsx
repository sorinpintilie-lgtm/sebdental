"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useCartStore } from "@/stores/useCartStore";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function CartDrawer() {
  const { isOpen, close, items, setQty, remove } = useCartStore();
  const lines = items.map((item) => ({ ...item, product: products.find((p) => p.id === item.productId) })).filter((l) => l.product);
  const subtotal = lines.reduce((acc, l) => acc + (l.product?.priceLei || 0) * l.qty, 0);
  const crossSell = products.slice(0, 3);

  return (
    <Sheet open={isOpen} onOpenChange={(o) => (!o ? close() : null)}>
      <SheetContent className="w-full border-l border-fg/10 bg-surface sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Coș</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {lines.map((l) => (
            <div key={l.productId} className="rounded-xl border border-fg/10 p-3">
              <p className="text-sm">{l.product?.name}</p>
              <div className="mt-2 flex items-center justify-between">
                <input className="w-16 rounded border border-fg/15 px-2 py-1" type="number" value={l.qty} onChange={(e) => setQty(l.productId, Number(e.target.value))} />
                <button className="text-sm text-copper" onClick={() => remove(l.productId)}>Șterge</button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 border-t border-fg/10 pt-4">
          <p className="text-sm text-fg/70">Subtotal: <span className="font-semibold text-fg">{subtotal} lei</span></p>
          <p className="text-xs text-fg/60">Livrare estimată: 24-48h</p>
          <Link href="/checkout"><Button className="mt-4 w-full bg-primary text-white">Continuă la checkout</Button></Link>
        </div>
        <div className="mt-6">
          <p className="mb-2 text-sm font-medium">Se cumpără împreună</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {crossSell.map((p) => (
              <div key={p.id} className="rounded-lg border border-fg/10 p-2">{p.name}</div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

