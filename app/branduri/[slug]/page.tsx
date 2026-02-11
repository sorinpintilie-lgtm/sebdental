import { notFound } from "next/navigation";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);
  if (!brand) return notFound();
  const list = products.filter((p) => p.brand === brand.name);

  return (
    <section className="space-y-6">
      <h1 className="text-3xl">{brand.name}</h1>
      <p className="text-fg/70">{brand.short}</p>
      <div className="grid gap-4 md:grid-cols-3">
        {list.slice(0, 9).map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}

