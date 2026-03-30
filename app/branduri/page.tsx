import Link from "next/link";
import type { Metadata } from "next";
import { brands } from "@/data/brands";

export const metadata: Metadata = {
  title: "Branduri de freze dentare",
  description:
    "Descoperă brandurile de freze dentare disponibile în stoc și accesează rapid produsele pentru fiecare producător.",
  alternates: {
    canonical: "/branduri",
  },
};

export default function BranduriPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl">Branduri</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {brands.map((b) => (
          <Link key={b.id} href={`/branduri/${b.slug}`} className="surface rounded-2xl p-5">
            <p className="font-medium">{b.name}</p>
            <p className="mt-1 text-sm text-fg/65">{b.origin}</p>
            <p className="mt-2 text-sm text-fg/75">{b.short}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

