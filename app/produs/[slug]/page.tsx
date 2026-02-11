import { notFound } from "next/navigation";
import { getProductBySlug, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default async function ProdusPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return notFound();

  const upsell = products.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 3);
  const crossSell = products
    .filter((p) => p.id !== product.id && p.application.some((app) => product.application.includes(app)))
    .slice(3, 6);

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface rounded-3xl p-8">
          <div className="mb-6 overflow-hidden rounded-2xl border border-fg/10">
            <Image
              src={product.image}
              alt={product.name}
              width={1200}
              height={700}
              className="h-72 w-full object-cover"
            />
          </div>
          <div className="mb-4 flex gap-2">
            <Badge variant="outline">{product.shank}</Badge>
            <Badge variant="outline">{product.grit}</Badge>
            <Badge variant="outline">Ø {product.diameterMm}</Badge>
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
          </div>
          <div className="mt-6 flex gap-2">
            <Button className="bg-fg text-bg hover:bg-fg/90">Adaugă în coș</Button>
            <Button variant="outline">Cere ofertă</Button>
          </div>
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
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {products.slice(10, 13).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Recomandări premium din același brand</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {upsell.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl">Se comandă frecvent împreună</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {crossSell.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}

