import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de retur",
  description: "Condițiile de retur pentru produsele comandate din platforma SebDental.",
  alternates: {
    canonical: "/politica-de-retur",
  },
};

export default function ReturPage() {
  return (
    <section className="max-w-3xl space-y-3 text-sm">
      <h1 className="text-3xl">Politica de retur</h1>
      <p>Retur posibil în 14 zile pentru produse neutilizate, în ambalaj original.</p>
    </section>
  );
}

