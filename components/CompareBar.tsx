"use client";

import { products } from "@/data/products";
import { useCompareStore } from "@/stores/useCompareStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMemo, useState } from "react";

export function CompareBar() {
  const { ids, clear } = useCompareStore();
  const [open, setOpen] = useState(false);
  const compareProducts = useMemo(() => products.filter((p) => ids.includes(p.id)).slice(0, 4), [ids]);
  if (ids.length < 2) return null;

  return (
    <>
      <div className="fixed bottom-4 left-1/2 z-40 w-[min(96%,760px)] -translate-x-1/2 rounded-2xl border border-primary/35 bg-surface p-3 shadow-soft">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-medium">Comparare activă: {ids.length} produse selectate</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={clear}>Resetează</Button>
            <Button size="sm" className="bg-primary text-white" onClick={() => setOpen(true)}>Deschide compararea</Button>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[1100px] border-fg/15 bg-surface p-0">
          <DialogHeader className="border-b border-fg/10 px-6 pt-6 pb-4">
            <DialogTitle>Comparare produse</DialogTitle>
            <DialogDescription>Diferențe cheie pentru alegere rapidă.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-auto px-6 pb-6">
            <table className="mt-4 w-full min-w-[860px] text-sm">
              <thead>
                <tr className="border-b border-fg/10 bg-fg/5">
                  <th className="p-3 text-left">Criteriu</th>
                  {compareProducts.map((p) => (
                    <th key={p.id} className="p-3 text-left">{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Compatibilitate", (p: (typeof compareProducts)[number]) => p.shank],
                  ["Material", (p: (typeof compareProducts)[number]) => p.material],
                  ["Granulație", (p: (typeof compareProducts)[number]) => p.grit],
                  ["Formă", (p: (typeof compareProducts)[number]) => p.shape],
                  ["Ø", (p: (typeof compareProducts)[number]) => `${p.diameterMm} mm`],
                  ["ISO", (p: (typeof compareProducts)[number]) => p.isoCode],
                  ["RPM recomandat", (p: (typeof compareProducts)[number]) => p.recommendedRpm],
                  ["Stoc", (p: (typeof compareProducts)[number]) => p.stockStatus],
                  ["Preț", (p: (typeof compareProducts)[number]) => `${p.priceLei} lei`],
                ].map(([label, get]) => (
                  <tr key={label as string} className="border-b border-fg/10">
                    <td className="p-3 font-medium">{label as string}</td>
                    {compareProducts.map((p) => (
                      <td key={p.id} className="p-3">{(get as (p: (typeof compareProducts)[number]) => string)(p)}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

