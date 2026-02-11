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
    </section>
  );
}

