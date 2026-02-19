"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Search, RotateCcw, Package } from "lucide-react";
import { useEffect, useState } from "react";

const slides = [
  {
    title: "Flux clar pentru cabinet: găsești freza potrivită în câteva secunde.",
    subtitle: "Compatibilitate, granulație și diametru vizibile din primul ecran.",
    image: "/young-female-dentist-in-dental-office-dentist-at-2026-01-09-06-51-47-utc.jpg",
  },
  {
    title: "Recomandări practice pentru reordonare rapidă și protocoale recurente.",
    subtitle: "SKU și ISO la vedere, fără pași inutili.",
    image: "/in-a-modern-medical-center-dentistry-checks-the-r-2026-01-05-05-35-48-utc.jpg",
  },
  {
    title: "Portofoliu complet pentru zirconiu, ceramică, compozit și metal.",
    subtitle: "Un singur loc pentru selecție rapidă, comenzi și comparație.",
    image: "/with-the-help-of-high-tech-equipment-and-expert-sk-2026-01-05-04-52-49-utc.jpg",
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
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl border border-primary/35 bg-surface md:hidden">
        <video
          className="h-[300px] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={primary.image}
        >
          <source src="/Woman-At-Dental-Chair-In-Dental-Clinic-Dental-Extr-4K-2025-12-17-06-16-53-Utc.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="rounded-xl border border-primary/35 bg-white/95 p-3 shadow-[0_14px_28px_rgb(var(--fg)/0.24)] backdrop-blur-sm">
            <h1 className="text-base leading-snug text-fg">{primary.title}</h1>
            <p className="mt-1 text-xs text-fg/75">{primary.subtitle}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/produse" className="rounded-lg bg-primary px-3 py-2 text-center text-xs font-semibold text-black shadow-sm">Vezi produse</Link>
              <Link href="/comanda-rapida" className="rounded-lg border border-black/20 bg-black/5 px-3 py-2 text-center text-xs text-black">Comandă rapidă</Link>
            </div>
          </div>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-primary" : "bg-white/45"}`}
            />
          ))}
        </div>
      </div>

      <div className="relative hidden overflow-hidden rounded-3xl border border-primary/35 bg-surface md:block">
        <video
          className="h-[460px] w-full object-cover md:h-[500px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={primary.image}
        >
          <source src="/Woman-At-Dental-Chair-In-Dental-Clinic-Dental-Extr-4K-2025-12-17-06-16-53-Utc.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/45 to-black/20" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 rounded-2xl border border-primary/40 bg-white/96 p-4 text-fg shadow-[0_18px_42px_rgb(var(--fg)/0.28)] backdrop-blur-sm md:bottom-5 md:left-5 md:right-5 md:max-w-3xl md:p-6"
        >
          <p className="inline-flex rounded-full border border-primary/45 bg-primary/20 px-2.5 py-1 text-[10px] uppercase tracking-wide text-black/75 md:text-[11px]">Freze dentare pentru protocoale clinice zilnice</p>
          <h1 className="mt-2 max-w-3xl text-xl leading-tight md:mt-3 md:text-3xl">{primary.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg/75 md:text-base">{primary.subtitle}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mt-5 md:flex md:flex-wrap md:gap-2">
            <Link href="/produse" className="rounded-xl bg-primary px-4 py-2 text-center text-sm font-semibold text-black">Vezi catalogul</Link>
            <Link href="/comanda-rapida" className="rounded-xl border border-black/25 bg-black/5 px-4 py-2 text-center text-sm text-black">Comandă rapidă</Link>
            <Link href="/listele-mele" className="rounded-xl border border-black/25 bg-black/5 px-4 py-2 text-center text-sm text-black">Listele mele</Link>
          </div>
        </motion.div>
        <div className="absolute right-3 top-3 flex gap-2 md:bottom-4 md:right-4 md:top-auto">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? "bg-primary" : "bg-white/45"}`}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <Link href="/produse" className="surface rounded-2xl p-4 transition hover:-translate-y-0.5">
          <Search className="h-4 w-4" />
          <p className="mt-2 font-medium">Căutare rapidă</p>
          <p className="mt-1 text-sm text-fg/70">Filtre după brand, material, granulație și compatibilitate.</p>
        </Link>
        <Link href="/cont" className="surface rounded-2xl p-4 transition hover:-translate-y-0.5">
          <RotateCcw className="h-4 w-4" />
          <p className="mt-2 font-medium">Reordonare rapidă</p>
          <p className="mt-1 text-sm text-fg/70">Acces la comenzi recente și adăugare rapidă în coș.</p>
        </Link>
        <Link href="/checkout" className="surface col-span-2 rounded-2xl p-4 transition hover:-translate-y-0.5 md:col-span-1">
          <Package className="h-4 w-4" />
          <p className="mt-2 font-medium">Pachete recomandate</p>
          <p className="mt-1 text-sm text-fg/70">Seturi pentru finisare, zirconiu și restaurări directe.</p>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {slides.map((slide, i) => (
          <div key={slide.title} className={`relative overflow-hidden rounded-2xl border border-fg/10 ${i === 0 ? "col-span-2" : "col-span-1"}`}>
            <Image src={slide.image} alt={slide.title} width={900} height={450} className="h-36 w-full object-cover blur-[2px] md:h-40 md:blur-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-fg/60 to-transparent" />
            <p className="absolute bottom-2 left-3 right-3 text-xs font-medium text-white">{slide.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

