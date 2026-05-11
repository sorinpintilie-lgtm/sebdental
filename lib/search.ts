import type { Product } from "@/lib/types";

export const normalizeSearchText = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/ø/g, "diametru")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const compactSearchText = (value: unknown) => normalizeSearchText(value).replace(/\s+/g, "");

export const getProductSearchText = (product: Product) => {
  const specs = product.specs ? Object.values(product.specs).join(" ") : "";
  return [
    product.name,
    product.sku,
    product.isoCode,
    product.brand,
    product.shank,
    product.material,
    product.shape,
    product.grit,
    product.colorCode,
    product.coating,
    product.application?.join(" "),
    product.bulletsShort?.join(" "),
    specs,
    product.diameterMm ? `${product.diameterMm} ${product.diameterMm.toFixed(1)} mm diametru` : "",
  ]
    .filter(Boolean)
    .join(" ");
};

export const productMatchesQuery = (product: Product, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return true;

  const haystack = normalizeSearchText(getProductSearchText(product));
  const compactHaystack = compactSearchText(getProductSearchText(product));
  const compactQuery = compactSearchText(query);
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return (
    haystack.includes(normalizedQuery) ||
    compactHaystack.includes(compactQuery) ||
    terms.every((term) => haystack.includes(term) || compactHaystack.includes(term))
  );
};

export const scoreProductSearch = (product: Product, query: string) => {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return product.isBestseller ? 10 : product.isNew ? 6 : 0;

  const compactQuery = compactSearchText(query);
  const name = normalizeSearchText(product.name);
  const sku = normalizeSearchText(product.sku);
  const iso = normalizeSearchText(product.isoCode);
  const brand = normalizeSearchText(product.brand);
  const shape = normalizeSearchText(product.shape);
  const material = normalizeSearchText(product.material);
  const full = normalizeSearchText(getProductSearchText(product));
  const compactSku = compactSearchText(product.sku);
  const compactIso = compactSearchText(product.isoCode);
  const compactFull = compactSearchText(getProductSearchText(product));
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  let score = 0;

  if (sku === normalizedQuery || compactSku === compactQuery) score += 1000;
  if (iso === normalizedQuery || compactIso === compactQuery) score += 950;
  if (sku.startsWith(normalizedQuery) || compactSku.startsWith(compactQuery)) score += 600;
  if (iso.startsWith(normalizedQuery) || compactIso.startsWith(compactQuery)) score += 580;
  if (name.includes(normalizedQuery)) score += 360;
  if (brand.includes(normalizedQuery)) score += 180;
  if (shape.includes(normalizedQuery)) score += 140;
  if (material.includes(normalizedQuery)) score += 100;
  if (full.includes(normalizedQuery)) score += 80;
  if (compactFull.includes(compactQuery)) score += 70;

  terms.forEach((term) => {
    if (sku.includes(term) || compactSku.includes(term)) score += 35;
    if (iso.includes(term) || compactIso.includes(term)) score += 35;
    if (name.includes(term)) score += 20;
    if (full.includes(term)) score += 8;
  });

  if (product.isBestseller) score += 6;
  if (product.isNew) score += 4;
  if (product.stockStatus === "in_stock") score += 2;

  return score;
};

export const searchProducts = (products: Product[], query: string, limit?: number) => {
  const normalizedQuery = normalizeSearchText(query);
  const results = normalizedQuery
    ? products
        .filter((product) => productMatchesQuery(product, query))
        .map((product) => ({ product, score: scoreProductSearch(product, query) }))
        .sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name, "ro"))
        .map(({ product }) => product)
    : [...products].sort((a, b) => {
        const aScore = scoreProductSearch(a, "");
        const bScore = scoreProductSearch(b, "");
        return bScore - aScore || a.name.localeCompare(b.name, "ro");
      });

  return typeof limit === "number" ? results.slice(0, limit) : results;
};