"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/data/products";
import { searchProducts } from "@/lib/search";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const openPalette = () => {
      setQ("");
      setOpen(true);
    };

    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((s) => !s);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search-palette", openPalette);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search-palette", openPalette);
    };
  }, []);

  const results = useMemo(() => searchProducts(products, q, 12), [q]);

  const goToAllResults = () => {
    const term = q.trim();
    router.push(term ? `/produse?q=${encodeURIComponent(term)}` : "/produse");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl border-fg/15 bg-surface p-0 shadow-soft">
        <DialogTitle className="sr-only">Căutare rapidă</DialogTitle>
        <Command
          shouldFilter={false}
          onKeyDown={(e) => {
            if (e.key === "Enter" && q.trim()) {
              e.preventDefault();
              goToAllResults();
            }
          }}
        >
          <CommandInput placeholder="Caută după SKU, ISO, brand, formă sau material..." value={q} onValueChange={setQ} />
          <CommandList>
            <CommandEmpty>Niciun rezultat.</CommandEmpty>
            <CommandGroup heading="Rezultate rapide">
              <CommandItem value="all-results" onSelect={goToAllResults}>
                <div className="flex w-full items-center justify-between gap-2">
                  <span className="truncate">
                    {q.trim() ? `Vezi toate rezultatele pentru „${q.trim()}”` : "Vezi toate produsele"}
                  </span>
                </div>
              </CommandItem>

              {results.map((p) => (
                <CommandItem key={p.id} value={p.id} onSelect={() => { router.push(`/produs/${p.slug}`); setOpen(false); }}>
                  <div className="flex w-full items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate">{p.name}</div>
                      <div className="truncate text-xs text-fg/55">{p.sku} · {p.brand} · {p.shape}</div>
                    </div>
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

