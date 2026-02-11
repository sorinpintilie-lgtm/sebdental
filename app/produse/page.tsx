import Link from "next/link";
import { products } from "@/data/products";
import { brands } from "@/data/brands";
import { ProductCard } from "@/components/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function ProdusePage({
  searchParams,
}: {
  searchParams: Promise<{
    brand?: string;
    compat?: string;
    q?: string;
    sort?: string;
    min?: string;
    max?: string;
    diametru?: string;
    color?: string;
    tip?: string;
  }>;
}) {
  const params = await searchParams;
  const brand = params.brand;
  const compat = params.compat;
  const q = (params.q ?? "").toLowerCase().trim();
  const sort = params.sort ?? "relevanta";
  const min = Number(params.min ?? 0);
  const max = Number(params.max ?? 9999);
  const diametru = params.diametru;
  const color = params.color;
  const tip = params.tip;

  let filtered = products.filter((p) => {
    const byBrand = brand ? p.brand === brand : true;
    const byCompat = compat ? p.shank === compat : true;
    const byPrice = p.priceLei >= min && p.priceLei <= max;
    const byDiameter = diametru ? p.diameterMm.toFixed(1) === diametru : true;
    const byColor = color ? p.colorCode === color : true;
    const byTip = tip ? p.shape === tip : true;
    const byQuery = q
      ? [p.name, p.sku, p.isoCode, p.brand, p.material, p.shape, p.colorCode].join(" ").toLowerCase().includes(q)
      : true;
    return byBrand && byCompat && byPrice && byDiameter && byColor && byTip && byQuery;
  });

  if (sort === "pret-mic") filtered = [...filtered].sort((a, b) => a.priceLei - b.priceLei);
  if (sort === "pret-mare") filtered = [...filtered].sort((a, b) => b.priceLei - a.priceLei);

  const uniqueDiameters = Array.from(new Set(products.map((p) => p.diameterMm.toFixed(1)))).sort((a, b) => Number(a) - Number(b));
  const uniqueColors = Array.from(new Set(products.map((p) => p.colorCode)));
  const uniqueTypes = Array.from(new Set(products.map((p) => p.shape)));

  const makeHref = (extra: Record<string, string | undefined>) => {
    const sp = new URLSearchParams();
    const merged = {
      brand,
      compat,
      q: q || undefined,
      sort,
      min: String(min),
      max: String(max),
      diametru,
      color,
      tip,
      ...extra,
    };
    Object.entries(merged).forEach(([k, v]) => {
      if (v && v.length > 0) sp.set(k, v);
    });
    return `/produse?${sp.toString()}`;
  };

  return (
    <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-max max-h-[calc(100vh-6rem)] space-y-6 overflow-y-auto rounded-2xl border border-fg/10 bg-surface p-5 lg:sticky lg:top-20">
        <h2 className="text-lg font-semibold">Filtre produse</h2>

        <Accordion type="multiple" className="w-full">
          <AccordionItem value="brand">
            <AccordionTrigger className="text-xs text-fg/80">Brand</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pb-1">
                {brands.map((b) => (
                  <Link key={b.id} href={makeHref({ brand: b.name })} className={`rounded-full border px-3 py-1 text-xs ${brand === b.name ? "border-primary bg-primary/15" : "border-fg/15"}`}>{b.name}</Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="compatibilitate">
            <AccordionTrigger className="text-xs text-fg/80">Compatibilitate</AccordionTrigger>
            <AccordionContent>
              <div className="flex gap-2 pb-1">
                {["FG", "RA", "HP"].map((s) => (
                  <Link key={s} href={makeHref({ compat: s })} className={`rounded-full border px-3 py-1 text-xs ${compat === s ? "border-primary bg-primary/15" : "border-fg/15"}`}>{s}</Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tip-freza">
            <AccordionTrigger className="text-xs text-fg/80">Tip freză</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pb-1">
                {uniqueTypes.map((t) => (
                  <Link key={t} href={makeHref({ tip: t })} className={`rounded-full border px-3 py-1 text-xs ${tip === t ? "border-primary bg-primary/15" : "border-fg/15"}`}>{t}</Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="diametru">
            <AccordionTrigger className="text-xs text-fg/80">Diametru</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pb-1">
                {uniqueDiameters.map((d) => (
                  <Link key={d} href={makeHref({ diametru: d })} className={`rounded-full border px-3 py-1 text-xs ${diametru === d ? "border-primary bg-primary/15" : "border-fg/15"}`}>Ø {d}</Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="culoare">
            <AccordionTrigger className="text-xs text-fg/80">Culoare</AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pb-1">
                {uniqueColors.map((c) => (
                  <Link key={c} href={makeHref({ color: c })} className={`rounded-full border px-3 py-1 text-xs ${color === c ? "border-primary bg-primary/15" : "border-fg/15"}`}>{c}</Link>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div>
          <div className="rounded-xl border border-fg/20 p-3">
            <form action="/produse" className="space-y-2">
              <input type="range" name="max" min={20} max={150} defaultValue={Math.min(max, 150)} className="w-full accent-primary" />
              <div className="flex items-center justify-between text-xs text-fg/70"><span>20 lei</span><span>{Math.min(max, 150)} lei</span></div>
              <input type="hidden" name="min" value="0" />
              <button className="w-full rounded-lg border border-fg/20 px-3 py-1.5 text-xs">Aplică bugetul</button>
            </form>
          </div>
        </div>

        <Link href="/produse" className="inline-block rounded-xl border border-fg/20 px-3 py-2 text-sm">Resetează filtrele</Link>
      </aside>

      <div>
        <h1 className="text-3xl">Catalog freze dentare</h1>
        <p className="mt-2 text-fg/70">Filtrează rapid după buget, diametru, culoare, compatibilitate și brand.</p>
        <div className="mt-4 grid gap-3 rounded-2xl border border-fg/10 bg-surface p-4 md:grid-cols-[1fr_260px]">
          <form action="/produse" className="flex gap-2">
            <input name="q" defaultValue={q} placeholder="Caută după SKU, ISO, brand, nume" className="w-full rounded-xl border border-fg/20 px-3 py-2 text-sm" />
            <button className="rounded-xl bg-fg px-4 py-2 text-sm text-bg">Caută</button>
          </form>
          <form action="/produse" className="flex gap-2">
            <select name="sort" defaultValue={sort} className="w-full rounded-xl border border-fg/20 px-3 py-2 text-sm">
              <option value="relevanta">Relevanță</option>
              <option value="pret-mare">Preț: cel mai mare</option>
              <option value="pret-mic">Preț: cel mai mic</option>
            </select>
            <button className="rounded-xl border border-fg/20 px-3 py-2 text-sm">Aplică</button>
          </form>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

