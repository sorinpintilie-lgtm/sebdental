import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { brands } from "@/data/brands";
import { products } from "@/data/products";
import { ProductCard } from "@/components/ProductCard";

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const brand = brands.find((b) => b.slug === slug);

  if (!brand) {
    return {
      title: "Brand indisponibil",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Freze ${brand.name}`,
    description: `${brand.short} Vezi selecția de freze ${brand.name} disponibile în catalog.`,
    alternates: {
      canonical: `/branduri/${brand.slug}`,
    },
  };
}

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

