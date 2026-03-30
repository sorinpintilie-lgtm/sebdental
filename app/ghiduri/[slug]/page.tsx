import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { articles } from "@/data/articles";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return {
      title: "Ghid indisponibil",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: `/ghiduri/${article.slug}`,
    },
  };
}

export default async function GhidPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return notFound();

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-3xl">{article.title}</h1>
      <p className="text-fg/70">{article.excerpt}</p>
      {article.sections.map((section) => (
        <section key={section.heading} className="surface rounded-2xl p-6">
          <h2 className="text-xl">{section.heading}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
            {section.bullets.map((b) => <li key={b}>{b}</li>)}
          </ul>
        </section>
      ))}
    </article>
  );
}

