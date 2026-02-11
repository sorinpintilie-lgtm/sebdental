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
    image: "/female-dentist-with-assistant-working-in-dental-cl-2026-01-07-07-00-33-utc.jpg",
  },
  {
    title: "Recomandări practice pentru reordonare rapidă și protocoale recurente.",
    subtitle: "SKU și ISO la vedere, fără pași inutili.",
    image: "/dental-tools-medical-equipment-2026-01-07-01-00-49-utc.jpg",
  },
  {
    title: "Portofoliu complet pentru zirconiu, ceramică, compozit și metal.",
    subtitle: "Un singur loc pentru selecție rapidă, comenzi și comparație.",
    image: "/young-female-dentist-in-dental-office-dentist-at-2026-01-09-06-51-47-utc.jpg",
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
      <div className="relative overflow-hidden rounded-3xl border border-fg/10 bg-surface md:hidden">
        <video
          className="h-[300px] w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={primary.image}
        >
          <source src="/Beautiful-Smile-And-Perfect-Teeth-In-Dental-Clinic-4K-2025-12-17-21-47-45-Utc.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <div className="rounded-xl border border-white/25 bg-white/92 p-3 backdrop-blur-sm">
            <h1 className="text-base leading-snug text-fg">{primary.title}</h1>
            <p className="mt-1 text-xs text-fg/75">{primary.subtitle}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href="/produse" className="rounded-lg bg-fg px-3 py-2 text-center text-xs font-medium text-bg">Vezi produse</Link>
              <Link href="/comanda-rapida" className="rounded-lg border border-fg/20 px-3 py-2 text-center text-xs text-fg">Comandă rapidă</Link>
            </div>
          </div>
        </div>
        <div className="absolute right-3 top-3 flex gap-2">
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

      <div className="relative hidden overflow-hidden rounded-3xl border border-fg/10 bg-surface md:block">
        <video
          className="h-[460px] w-full object-cover md:h-[500px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={primary.image}
        >
          <source src="/Beautiful-Smile-And-Perfect-Teeth-In-Dental-Clinic-4K-2025-12-17-21-47-45-Utc.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-black/10" />
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/35 bg-white/96 p-4 text-fg shadow-xl backdrop-blur-sm md:bottom-5 md:left-5 md:right-5 md:max-w-3xl md:p-6"
        >
          <p className="inline-flex rounded-full border border-fg/15 bg-bg px-2.5 py-1 text-[10px] uppercase tracking-wide text-fg/70 md:text-[11px]">Freze dentare pentru protocoale clinice zilnice</p>
          <h1 className="mt-2 max-w-3xl text-xl leading-tight md:mt-3 md:text-3xl">{primary.title}</h1>
          <p className="mt-2 max-w-2xl text-sm text-fg/75 md:text-base">{primary.subtitle}</p>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 md:mt-5 md:flex md:flex-wrap md:gap-2">
            <Link href="/produse" className="rounded-xl bg-fg px-4 py-2 text-center text-sm font-medium text-bg">Vezi catalogul</Link>
            <Link href="/comanda-rapida" className="rounded-xl border border-fg/20 px-4 py-2 text-center text-sm text-fg">Comandă rapidă</Link>
            <Link href="/listele-mele" className="rounded-xl border border-fg/20 px-4 py-2 text-center text-sm text-fg">Listele mele</Link>
          </div>
        </motion.div>
        <div className="absolute right-3 top-3 flex gap-2 md:bottom-4 md:right-4 md:top-auto">
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

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
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
        <Link href="/checkout" className="surface rounded-2xl p-4 transition hover:-translate-y-0.5 sm:col-span-2 md:col-span-1">
          <Package className="h-4 w-4" />
          <p className="mt-2 font-medium">Pachete recomandate</p>
          <p className="mt-1 text-sm text-fg/70">Seturi pentru finisare, zirconiu și restaurări directe.</p>
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
        {slides.map((slide) => (
          <div key={slide.title} className="relative overflow-hidden rounded-2xl border border-fg/10">
            <Image src={slide.image} alt={slide.title} width={900} height={450} className="h-36 w-full object-cover md:h-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-fg/60 to-transparent" />
            <p className="absolute bottom-2 left-3 right-3 text-xs font-medium text-white">{slide.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

