"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, GitCompareArrows } from "lucide-react";
import { Product } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import { useWishlistStore } from "@/stores/useWishlistStore";
import { useCompareStore } from "@/stores/useCompareStore";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((s) => s.add);
  const wishlistIds = useWishlistStore((s) => s.ids);
  const compareIds = useCompareStore((s) => s.ids);
  const toggleWishlist = useWishlistStore((s) => s.toggle);
  const toggleCompare = useCompareStore((s) => s.toggle);
  const inWishlist = wishlistIds.includes(product.id);
  const inCompare = compareIds.includes(product.id);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-fg/10 bg-surface shadow-soft transition hover:-translate-y-1">
      <Link href={`/produs/${product.slug}`} className="relative block">
        <div className="relative h-52 w-full overflow-hidden bg-white">
          <Image
            src={product.image}
            alt={product.name}
            width={600}
            height={420}
            className="relative z-10 h-full w-full object-contain p-2"
          />
        </div>
        <div className="absolute left-3 top-3 z-20 flex items-center gap-2">
          <Badge className="bg-white/95 text-fg">{product.shank}</Badge>
          <Badge className="bg-white/95 text-fg">{product.grit}</Badge>
        </div>
      </Link>
      <div className="flex h-full flex-col p-5">
        <Link href={`/produs/${product.slug}`} className="block">
          <h3 className="line-clamp-2 text-base font-semibold">{product.name}</h3>
        </Link>
        <p className="mt-1 text-sm text-fg/65">{product.brand} • Ø {product.diameterMm} mm</p>
        <p className="mt-2 mono text-xs text-fg/60">Cod: {product.sku}</p>
        <p className="mt-3 text-xl font-semibold">{product.priceLei} lei</p>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-4">
        <Button size="sm" className="w-full bg-fg text-bg hover:bg-fg/90" onClick={() => add(product.id)}>Adaugă în coș</Button>
        <Link href={`/produs/${product.slug}`} className="w-full"><Button size="sm" variant="outline" className="w-full">Detalii</Button></Link>
        <Button
          size="sm"
          variant="outline"
          className={`w-full justify-start gap-2 rounded-xl ${inWishlist ? "border-primary/60 bg-primary/10" : "border-fg/20"}`}
          onClick={() => toggleWishlist(product.id)}
          aria-label="Favorite"
        >
          <Heart className={`h-4 w-4 ${inWishlist ? "fill-primary text-primary" : "text-fg/70"}`} />
          Favorite
        </Button>
        <Button
          size="sm"
          variant="outline"
          className={`w-full justify-start gap-2 rounded-xl ${inCompare ? "border-primary/60 bg-primary/10" : "border-fg/20"}`}
          onClick={() => toggleCompare(product.id)}
          aria-label="Compară"
        >
          <GitCompareArrows className={`h-4 w-4 ${inCompare ? "text-primary" : "text-fg/70"}`} />
          Compară
        </Button>
        </div>
      </div>
    </article>
  );
}

