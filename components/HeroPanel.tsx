"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, GitCompareArrows, Package } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Freze pentru zirconiu, selecție clară pe granulație și diametru.",
    subtitle: "Gamă optimizată pentru ajustare rapidă și finisare controlată.",
    image: "https://picsum.photos/seed/dent-hero-1/1800/900",
  },
  {
    title: "Comenzi recurente fără erori: SKU, ISO, compatibilitate vizibile.",
    subtitle: "Tot ce ai nevoie pentru reaprovizionare în câteva click-uri.",
    image: "https://picsum.photos/seed/dent-hero-2/1800/900",
  },
  {
    title: "Portofoliu complet pentru ceramică, compozit, metal și protetică.",
    subtitle: "Compari rapid produsele și alegi varianta potrivită cazului clinic.",
    image: "https://picsum.photos/seed/dent-hero-3/1800/900",
  },
];

export function HeroPanel() {
  const [index, setIndex] = useState(0);
  const primary = slides[index];

  useEffect(() => {
    const t = setInterval(() => setIndex((v) => (v + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="space-y-4">
      <div className="relative overflow-hidden rounded-3xl border border-fg/10 bg-surface">
        <Image src={primary.image} alt="Instrumente stomatologice" width={1800} height={900} className="h-[440px] w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-fg/20 via-fg/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-4 right-4 rounded-2xl border border-fg/10 bg-surface/95 p-6 text-fg"
        >
          <h1 className="max-w-3xl text-3xl leading-tight md:text-4xl">{primary.title}</h1>
          <p className="mt-3 max-w-2xl text-fg/75">{primary.subtitle}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link href="/produse" className="rounded-xl bg-fg px-4 py-2 text-sm font-medium text-bg">Vezi catalogul</Link>
            <Link href="/produse?compara=1" className="rounded-xl border border-fg/20 px-4 py-2 text-sm text-fg">Compară produse</Link>
          </div>
        </motion.div>
        <div className="absolute bottom-4 right-4 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-white" : "bg-white/45"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Link href="/produse" className="surface rounded-2xl p-4 hover:-translate-y-0.5 transition">
          <Search className="h-4 w-4" />
          <p className="mt-2 font-medium">Căutare rapidă</p>
          <p className="mt-1 text-sm text-fg/70">Filtre după brand, material, granulație și compatibilitate.</p>
        </Link>
        <Link href="/produse?compara=1" className="surface rounded-2xl p-4 hover:-translate-y-0.5 transition">
          <GitCompareArrows className="h-4 w-4" />
          <p className="mt-2 font-medium">Comparare directă</p>
          <p className="mt-1 text-sm text-fg/70">Vizualizezi diferențele tehnice între produse într-un tabel clar.</p>
        </Link>
        <Link href="/checkout" className="surface rounded-2xl p-4 hover:-translate-y-0.5 transition">
          <Package className="h-4 w-4" />
          <p className="mt-2 font-medium">Pachete recomandate</p>
          <p className="mt-1 text-sm text-fg/70">Seturi pentru finisare, zirconiu și restaurări directe.</p>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.title} className="relative overflow-hidden rounded-2xl border border-fg/10">
            <Image src={slide.image} alt={slide.title} width={900} height={450} className="h-36 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-fg/60 to-transparent" />
            <p className="absolute bottom-2 left-3 right-3 text-xs font-medium text-white">{slide.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

