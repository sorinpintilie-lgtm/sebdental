"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const results = useMemo(() => {
    const term = q.toLowerCase().trim();
    if (!term) return products.slice(0, 12);
    return products
      .filter((p) => [p.name, p.sku, p.isoCode, p.shape, p.material, p.grit].join(" ").toLowerCase().includes(term))
      .slice(0, 12);
  }, [q]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl border-fg/15 bg-surface p-0 shadow-soft">
        <DialogTitle className="sr-only">Căutare rapidă</DialogTitle>
        <Command>
          <CommandInput placeholder="Caută după SKU, ISO sau nume..." value={q} onValueChange={setQ} />
          <CommandList>
            <CommandEmpty>Niciun rezultat.</CommandEmpty>
            <CommandGroup heading="Produse">
              {results.map((p) => (
                <CommandItem key={p.id} onSelect={() => { router.push(`/produs/${p.slug}`); setOpen(false); }}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="truncate">{p.name}</div>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline">{p.shank}</Badge>
                      <Badge variant="outline">Ø {p.diameterMm}</Badge>
                      <Badge variant="outline">{p.material}</Badge>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

