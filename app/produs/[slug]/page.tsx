import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Headset, ShoppingCart, Truck } from "lucide-react";

export default async function ProdusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const upsell = products.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 3);
  const crossSell = products
    .filter((p) => p.id !== product.id && p.application.some((app) => product.application.includes(app)))
    .slice(3, 6);
  const alternativeByShank = products
    .filter((p) => p.id !== product.id && p.shank === product.shank && p.material !== product.material)
    .slice(0, 3);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface rounded-3xl p-8">
          <div className="mb-6 relative h-[320px] w-full overflow-hidden rounded-2xl border border-fg/10 bg-white">
            <Image
              src={product.image}
              alt={product.name}
              width={1200}
              height={700}
              className="h-full w-full object-contain p-3"
              priority
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white/80 to-transparent" />
          </div>
          <div className="mb-4 flex gap-2">
            <Badge variant="outline">{product.shank}</Badge>
            <Badge variant="outline">{product.grit}</Badge>
            <Badge variant="outline">Ø {product.diameterMm}</Badge>
            <Badge variant="outline">{product.material}</Badge>
          </div>
          <h1 className="text-3xl">{product.name}</h1>
          <p className="mt-2 text-fg/70">{product.isoCode}</p>
          <p className="mt-4 text-2xl font-semibold">{product.priceLei} lei</p>
          <div className="mt-6 rounded-2xl border border-fg/10 p-4 text-sm">
            <p className="font-medium">Compatibilitate {product.shank}</p>
            <p className="mt-1 text-fg/70">FG = turbină, RA = contraunghi, HP = piesă de mână.</p>
          </div>
        </div>
        <div className="surface rounded-3xl p-6">
          <p className="text-sm font-medium">Informații de încredere</p>
          <div className="mt-3 grid gap-2 text-sm text-fg/75">
            <p>Garanție comercială: 30 zile</p>
            <p>Certificări: CE și ISO</p>
            <p>Evaluări clienți: {product.reviewCount} recenzii</p>
            <p>Stoc curent: {product.stockStatus === "in_stock" ? "În stoc" : product.stockStatus === "low_stock" ? "Stoc limitat" : "La comandă"}</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-fg/10 bg-white p-2">
              <p className="text-fg/60">Livrare</p>
              <p className="mt-1 font-medium text-fg">24–48h</p>
            </div>
            <div className="rounded-xl border border-fg/10 bg-white p-2">
              <p className="text-fg/60">Ambalare</p>
              <p className="mt-1 font-medium text-fg">Sterilă</p>
            </div>
            <div className="rounded-xl border border-fg/10 bg-white p-2">
              <p className="text-fg/60">Trasabilitate</p>
              <p className="mt-1 font-medium text-fg">Lot activ</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl border border-fg/10 p-3 text-xs mono">
            <p>SKU: {product.sku}</p>
            <p>ISO: {product.isoCode}</p>
            <p>Ø: {product.diameterMm} mm</p>
            <p>RPM: {product.recommendedRpm}</p>
          </div>
          <div className="mt-4 rounded-2xl border border-fg/10 bg-white p-3 text-xs text-fg/70">
            <p className="font-medium text-fg">Notă clinică</p>
            <p className="mt-1">Recomandat pentru utilizare cu răcire adecvată și presiune constantă redusă, conform protocolului materialului tratat.</p>
          </div>
          <div className="mt-6 flex gap-2">
            <Button className="bg-fg text-bg hover:bg-fg/90">Adaugă în coș</Button>
            <Button variant="outline">Cere ofertă</Button>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2 text-xs text-fg/70 sm:grid-cols-2">
            <div className="flex items-center gap-2 rounded-xl border border-fg/15 px-3 py-2">
              <Headset className="h-3.5 w-3.5 text-primary" />
              <span>Suport 24/7</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-fg/15 px-3 py-2">
              <Truck className="h-3.5 w-3.5 text-primary" />
              <span>Livrare rapidă</span>
            </div>
          </div>
        </div>
      </section>

      <section className="surface rounded-2xl p-6">
        <h2 className="text-xl">Recomandat pentru protocolul tău</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {product.application.slice(0, 3).map((app) => (
            <div key={app} className="rounded-xl border border-fg/10 bg-white p-3 text-sm">
              <p className="font-medium">{app}</p>
              <p className="mt-1 text-fg/65">Potrivire bună cu {product.material.toLowerCase()} și granulație {product.grit.toLowerCase()}.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="surface rounded-2xl p-6">
          <h2 className="mb-3 text-xl">Pe scurt</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {product.bulletsShort.slice(0, 5).map((b) => <li key={b}>{b}</li>)}
          </ul>
        </div>
        <div className="surface rounded-2xl p-6">
          <h2 className="mb-3 text-xl">Specificații</h2>
          <div className="grid gap-2 text-sm mono">
            {Object.entries(product.specs).map(([k, v]) => (
              <div key={k} className="grid grid-cols-2 border-b border-fg/10 py-2"><span>{k}</span><span>{v}</span></div>
            ))}
          </div>
        </div>
        <div className="surface rounded-2xl p-6">
          <h2 className="mb-3 text-xl">Utilizare</h2>
          <ul className="list-disc space-y-2 pl-5 text-sm">
            {product.warnings.map((w) => <li key={w}>{w}</li>)}
          </ul>
        </div>
        <div className="surface rounded-2xl p-6 text-sm">
          <h2 className="mb-3 text-xl">Recenzii</h2>
          Rating {product.rating.toFixed(1)} / 5 din {product.reviewCount} recenzii.
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Funcționează excelent împreună</h2>
        <p className="mt-1 text-sm text-fg/70">Recomandare practică: freză + mandrină + instrument complementar pentru același protocol.</p>
        <div className="mt-4 rounded-2xl border border-fg/10 bg-surface p-4">
          <div className="flex gap-3 overflow-x-auto pb-1 md:grid md:gap-3 md:overflow-visible md:pb-0 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto] md:items-stretch">
            {products.slice(10, 13).map((p, index) => (
              <div key={p.id} className="contents">
                <div className="min-w-[280px] rounded-xl border border-fg/10 bg-white p-3 md:min-w-0">
                  <ProductCard product={p} />
                </div>
                {index < 2 && (
                  <div className="hidden items-center justify-center md:flex">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-fg/20 bg-bg text-lg">+</span>
                  </div>
                )}
              </div>
            ))}
            <div className="hidden items-center justify-center md:flex">
              <div className="w-[220px] rounded-2xl border border-primary/30 bg-primary/10 p-3 text-center">
                <p className="text-xs text-fg/70">Pachet recomandat</p>
                <p className="mt-1 text-sm font-semibold">Economisești timp la fiecare comandă</p>
                <Button className="mt-3 w-full rounded-xl bg-primary px-4 py-2 text-xs text-white hover:bg-primary/90">
                  <ShoppingCart className="mr-2 h-3.5 w-3.5" />
                  Adaugă setul în coș
                </Button>
                <p className="mt-2 text-[11px] text-fg/60">3 produse pregătite pentru același protocol</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-fg/10 bg-surface p-5">
        <h2 className="text-2xl">Recomandări premium din același brand</h2>
        <p className="mt-1 text-sm text-fg/70">Selecție curată din gama {product.brand}, orientată pe consistență.</p>
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {upsell.map((p) => (
            <div key={p.id} className="min-w-[280px] rounded-xl border border-fg/10 bg-white p-2 md:min-w-0">
              <p className="px-2 pt-2 text-xs text-fg/60 mono">Premium • {p.brand}</p>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-fg/10 bg-surface p-5">
        <h2 className="text-2xl">Se comandă frecvent împreună</h2>
        <p className="mt-1 text-sm text-fg/70">Istoric de comandă: combinații recurente pentru același tip de lucrare.</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-fg/10 bg-white p-3">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory">
            {crossSell.map((p) => (
              <div key={p.id} className="min-w-[290px] max-w-[320px] flex-none snap-start">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-fg/60">Glisează orizontal pentru a vedea toate recomandările.</p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Alternative pe aceeași compatibilitate {product.shank}</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-1 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
          {alternativeByShank.map((p) => (
            <div key={p.id} className="min-w-[280px] md:min-w-0">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

