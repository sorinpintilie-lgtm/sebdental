"use client";

import dynamic from "next/dynamic";

const PdfFlipbook = dynamic(
  () => import("@/components/PdfFlipbook"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[560px] items-center justify-center rounded-xl border border-fg/10 bg-white text-sm text-fg/60">
        Se încarcă catalogul...
      </div>
    ),
  }
);

export function CatalogSection() {
  return (
    <div className="space-y-4 pt-4">
      <h2 className="text-2xl">Cataloage digitale</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="surface rounded-2xl p-4">
          <p className="mb-3 text-sm text-fg/70">Laborkatalog 2023</p>
          <PdfFlipbook
            title="Laborkatalog 2023"
            file="/EDENTA%20LABORATOR_230822_140644.pdf"
          />
        </article>

        <article className="surface rounded-2xl p-4">
          <p className="mb-3 text-sm text-fg/70">Praxiskatalog</p>
          <PdfFlipbook
            title="Praxiskatalog"
            file="/Praxiskatalog.pdf"
          />
        </article>
      </div>
    </div>
  );
}

export default CatalogSection;