import Link from "next/link";
import { articles } from "@/data/articles";

export default function GhiduriPage() {
  return (
    <section className="space-y-6">
      <h1 className="text-3xl">Ghiduri</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {articles.map((a) => (
          <Link key={a.id} href={`/ghiduri/${a.slug}`} className="surface rounded-2xl p-6">
            <p className="font-medium">{a.title}</p>
            <p className="mt-2 text-sm text-fg/70">{a.excerpt}</p>
          </Link>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <h2 className="text-2xl">Cataloage digitale</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <article className="surface rounded-2xl p-4">
            <p className="mb-3 text-sm text-fg/70">Laborkatalog 2023</p>
            <div className="overflow-hidden rounded-xl border border-fg/10 bg-white">
              <iframe
                src="https://www.yumpu.com/de/embed/view/67437729/laborkatalog-2023"
                title="Laborkatalog 2023"
                className="h-[560px] w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </article>

          <article className="surface rounded-2xl p-4">
            <p className="mb-3 text-sm text-fg/70">Praxiskatalog</p>
            <div className="overflow-hidden rounded-xl border border-fg/10 bg-white">
              <iframe
                src="https://www.yumpu.com/de/embed/view/68659621/praxiskatalog"
                title="Praxiskatalog"
                className="h-[560px] w-full"
                loading="lazy"
                allowFullScreen
              />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

