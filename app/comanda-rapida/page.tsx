"use client";

import { useState } from "react";
import { products } from "@/data/products";
import { useCartStore } from "@/stores/useCartStore";

interface RowData {
  code: string;
  productId: string;
  qty: number;
}

const emptyRow = (): RowData => ({ code: "", productId: "", qty: 1 });

export default function ComandaRapidaPage() {
  const [rows, setRows] = useState<RowData[]>(Array.from({ length: 10 }, emptyRow));
  const add = useCartStore((s) => s.add);

  const updateCode = (idx: number, code: string) => {
    const match = products.find((p) => [p.sku, p.isoCode, p.name].join(" ").toLowerCase().includes(code.toLowerCase()));
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, code, productId: match?.id ?? "" } : r)));
  };

  return (
    <section className="space-y-6">
      <h1 className="text-3xl">Comandă rapidă</h1>
      <p className="text-fg/70">Introdu coduri SKU/ISO, Enter adaugă rând nou.</p>
      <div className="overflow-x-auto rounded-2xl border border-fg/10 bg-surface">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-fg/10">
              <th className="p-3 text-left">Cod (SKU/ISO)</th>
              <th className="p-3 text-left">Produs</th>
              <th className="p-3 text-left">Cantitate</th>
              <th className="p-3 text-left">Șterge</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => {
              const product = products.find((p) => p.id === row.productId);
              return (
                <tr key={idx} className="border-b border-fg/10">
                  <td className="p-3">
                    <input
                      className="w-full rounded border border-fg/15 px-3 py-2"
                      value={row.code}
                      onChange={(e) => updateCode(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          setRows((prev) => [...prev, emptyRow()]);
                        }
                      }}
                    />
                  </td>
                  <td className="p-3">{product?.name ?? "-"}</td>
                  <td className="p-3">
                    <input
                      type="number"
                      className="w-20 rounded border border-fg/15 px-3 py-2"
                      value={row.qty}
                      onChange={(e) => setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, qty: Number(e.target.value) } : r)))}
                    />
                  </td>
                  <td className="p-3">
                    <button className="text-copper" onClick={() => setRows((prev) => prev.filter((_, i) => i !== idx))}>Șterge</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex gap-3">
        <button className="rounded-xl border border-fg/15 px-4 py-2" onClick={() => setRows((prev) => [...prev, emptyRow()])}>Adaugă rând</button>
        <button
          className="rounded-xl bg-primary px-4 py-2 text-white"
          onClick={() => rows.forEach((r) => r.productId && add(r.productId, r.qty))}
        >
          Adaugă în coș
        </button>
      </div>
    </section>
  );
}

