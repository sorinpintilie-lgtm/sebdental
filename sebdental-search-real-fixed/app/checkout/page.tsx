"use client";

import { useState } from "react";

const pasi = ["Date", "Livrare", "Confirmare"];

export default function CheckoutPage() {
  const [pas, setPas] = useState(0);
  return (
    <section className="max-w-3xl space-y-6">
      <h1 className="text-3xl">Checkout</h1>
      <div className="flex gap-2">
        {pasi.map((p, i) => <div key={p} className={`rounded-full px-4 py-1 text-sm ${i === pas ? "bg-primary text-white" : "bg-fg/8"}`}>{p}</div>)}
      </div>
      <div className="surface rounded-2xl p-6 text-sm">Plata se finalizează securizat după confirmarea datelor de livrare.</div>
      <button className="rounded-xl border border-fg/15 px-4 py-2" onClick={() => setPas((v) => (v + 1) % pasi.length)}>Pas următor</button>
    </section>
  );
}

