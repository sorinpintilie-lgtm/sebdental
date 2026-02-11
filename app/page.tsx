import Link from "next/link";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { HeroPanel } from "@/components/HeroPanel";
import { ProductCard } from "@/components/ProductCard";

const aplicatii = ["Zirconiu", "Ceramică", "Compozit", "Metal"];

const pachete = [
  { title: "Set restaurări ceramice", items: "Freze fine + medium + instrument de finisare", price: "399 lei" },
  { title: "Set protetică zirconiu", items: "Freze coarse + medium + corector contur", price: "449 lei" },
  { title: "Set restaurări directe", items: "Freze compozit pentru modelare și finisare", price: "369 lei" },
];

export default function HomePage() {
  const best = products.filter((p) => p.isBestseller).slice(0, 8);

  return (
    <div className="space-y-16">
      <section className="-mx-4 md:-mx-8">
        <HeroPanel />
      </section>

      <section className="grid gap-4 lg:grid-cols-12">
        <article className="surface rounded-3xl p-4 sm:p-6 lg:col-span-7">
          <h2 className="text-xl sm:text-2xl">Alege după aplicație clinică</h2>
          <div className="mt-5 grid grid-cols-2 gap-3">
            {aplicatii.map((a) => (
              <Link key={a} href={`/produse?aplicatie=${encodeURIComponent(a)}`} className="rounded-2xl border border-fg/10 p-3 sm:p-4">
                <p className="text-sm font-medium sm:text-base">{a}</p>
                <p className="mt-1 text-xs text-fg/70 sm:text-sm">Produse selectate pentru rezultate predictibile.</p>
              </Link>
            ))}
          </div>
        </article>

        <article className="surface rounded-3xl p-4 sm:p-6 lg:col-span-5">
          <h2 className="text-xl sm:text-2xl">Pachete recomandate</h2>
          <div className="mt-5 flex gap-3 overflow-x-auto pb-1 lg:block lg:space-y-3 lg:overflow-visible lg:pb-0">
            {pachete.map((p) => (
              <div key={p.title} className="min-w-[220px] rounded-2xl border border-fg/10 p-3 sm:min-w-[260px] sm:p-4 lg:min-w-0">
                <p className="text-sm font-semibold sm:text-base">{p.title}</p>
                <p className="mt-1 text-xs text-fg/70 sm:text-sm">{p.items}</p>
                <p className="mt-2 text-sm font-semibold sm:mt-3 sm:text-base">{p.price}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <h2 className="text-2xl">Branduri în stoc</h2>
          <Link href="/produse" className="text-sm text-fg/70">Vezi toate produsele</Link>
        </div>
        <div className="overflow-hidden rounded-2xl border border-fg/10 bg-surface py-4">
          <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-3 px-4">
            {[...brands, ...brands, ...brands].map((b, i) => (
              <Link key={`${b.id}-${i}`} href={`/produse?brand=${encodeURIComponent(b.name)}`} className="whitespace-nowrap rounded-full border border-fg/15 px-4 py-2 text-sm">
                {b.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-xl sm:text-2xl">Produse bestseller</h2>
          <Link href="/produse" className="text-sm text-fg/70">Vezi catalogul complet</Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {best.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
