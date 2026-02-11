"use client";

import Link from "next/link";
import { useCompareStore } from "@/stores/useCompareStore";
import { Button } from "@/components/ui/button";

export function CompareBar() {
  const { ids, clear } = useCompareStore();
  if (ids.length < 2) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-40 w-[min(96%,680px)] -translate-x-1/2 rounded-2xl border border-fg/10 bg-surface p-3 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{ids.length} produse selectate pentru comparare</p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={clear}>Resetează</Button>
          <Link href="/produse?compara=1"><Button size="sm" className="bg-primary text-white">Vezi tabel</Button></Link>
        </div>
      </div>
    </div>
  );
}

