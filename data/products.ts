import { Product } from "@/lib/types";

const baseShapes = ["Flacără", "Cilindrică", "Con invers", "Sferică", "Olivă", "Ac"];
const applications = [
  ["Zirconiu", "Finisare"],
  ["Ceramică", "Ajustare"],
  ["Compozit", "Conturare"],
  ["Metal", "Secționare"],
  ["Endodonție", "Acces"],
  ["Protetică", "Ajustare"],
];
const materials: Product["material"][] = ["Carbid", "Diamant", "Ceramică"];
const shanks: Product["shank"][] = ["FG", "RA", "HP"];
const grits = ["Fine", "Medium", "Coarse"];
const brands = ["Komet", "Meisinger", "KaVo", "NTI", "Edenta", "Prima Dental", "Busch", "Horico"];
const productImages = [
  "/freza-komet-taiat-coroane-h40-314-012~5271.jpg",
  "/freze-komet-diamantate-sferice-cu-gat-lung-014-016-018~8358118.jpg",
  "/komet-h4mcxl314014~4646.jpg",
  "/set-5-freze-diamantate-cu-inel-albastru-tf-11~5157.jpg",
  "/freza1.jpg",
  "/freza2.jpg",
  "/freza3.jpg",
  "/freza-endo-z-tri-hawk-line-extra-long-fg151l~6359.jpg",
  "/freza-komet-taiat-coroane-h34l-314-012~5270.jpg",
];
const colors = ["Albastru", "Verde", "Roșu", "Negru", "Auriu"];

export const products: Product[] = Array.from({ length: 40 }, (_, i) => {
  const idx = i + 1;
  const shank = shanks[i % shanks.length];
  const material = materials[i % materials.length];
  const app = applications[i % applications.length];
  const grit = grits[i % grits.length];
  const diameter = Number((1.0 + (i % 8) * 0.2).toFixed(1));
  const stockStatus: Product["stockStatus"] = i % 9 === 0 ? "low_stock" : i % 13 === 0 ? "backorder" : "in_stock";

  return {
    id: `p-${idx}`,
    slug: `freza-dentara-${idx}`,
    name: `Freză ${material} ${baseShapes[i % baseShapes.length]} ${shank}`,
    image: productImages[i % productImages.length],
    colorCode: colors[i % colors.length],
    priceLei: 39 + (i % 10) * 7,
    brand: brands[i % brands.length],
    sku: `FD-${shank}-${String(1000 + idx)}`,
    isoCode: `ISO 806 31${String(10 + (i % 80)).padStart(2, "0")} ${String(100 + (i % 70)).padStart(3, "0")}`,
    shank,
    material,
    application: app,
    grit,
    shape: baseShapes[i % baseShapes.length],
    diameterMm: diameter,
    recommendedRpm: material === "Diamant" ? "120.000 - 160.000" : "80.000 - 140.000",
    coating: i % 4 === 0 ? "TiN" : undefined,
    stockStatus,
    isNew: i % 7 === 0,
    isBestseller: i % 5 === 0,
    rating: 4.2 + ((i % 7) * 0.1 > 0.7 ? 0.7 : (i % 7) * 0.1),
    reviewCount: 12 + i * 3,
    bulletsShort: [
      "Tăiere stabilă, vibrații reduse.",
      "Compatibilă cu turbină standard.",
      "Control bun la margini cervicale.",
      "Lot verificat pentru concentricitate.",
    ].slice(0, 3 + (i % 2)),
    specs: {
      Compatibilitate: shank,
      Material: material,
      Granulație: grit,
      Formă: baseShapes[i % baseShapes.length],
      "Diametru (mm)": diameter.toString(),
      ISO: `806 314 ${String(100 + (i % 90)).padStart(3, "0")}`,
      "RPM recomandat": material === "Diamant" ? "120k-160k" : "80k-140k",
      Brand: brands[i % brands.length],
    },
    warnings: [
      "Utilizați răcire adecvată în lucru continuu.",
      "Nu depășiți turația recomandată.",
      "Înlocuiți freza la semne de uzură vizibilă.",
    ].slice(0, 2 + (i % 2)),
  };
});

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

