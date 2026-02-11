"use client";

import Link from "next/link";
import { Search, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";

const links = [
  ["/", "Acasă"],
  ["/produse", "Produse"],
  ["/produse?compara=1", "Compară"],
  ["/cont", "Cont"],
  ["/contact", "Contact"],
];

export function Header() {
  const open = useCartStore((s) => s.open);
  const count = useCartStore((s) => s.items.reduce((acc, i) => acc + i.qty, 0));

  return (
    <header className="sticky top-0 z-40 border-b border-primary/30 bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 md:px-8">
        <Link href="/" className="font-semibold tracking-tight">FrezeDentare Pro</Link>
        <nav className="hidden gap-6 text-sm md:flex">
          {links.map(([href, label]) => (
            <Link key={href} href={href} className="text-fg/75 transition hover:text-fg">{label}</Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="focus-ring border-primary/40 text-fg hover:bg-primary/10" aria-label="Caută produse">
            <Search className="h-4 w-4" />
            <span className="ml-2 hidden sm:inline">Caută</span>
            <kbd className="ml-3 hidden rounded border border-fg/15 px-1.5 py-0.5 text-[10px] text-fg/60 lg:inline">Ctrl+K</kbd>
          </Button>
          <Button size="sm" className="bg-primary text-fg hover:bg-primary/85" onClick={open} aria-label="Deschide coșul">
            <ShoppingCart className="h-4 w-4" />
            <span className="ml-2">{count}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}

