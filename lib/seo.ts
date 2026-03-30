export const SITE_NAME = "SebDental";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sebdental.ro";

export const DEFAULT_TITLE = "Freze dentare profesionale pentru cabinet și laborator";
export const DEFAULT_DESCRIPTION =
  "Catalog de freze dentare cu filtre rapide după compatibilitate FG/RA/HP, granulație, diametru și brand. Comandă rapidă, livrare predictibilă și suport tehnic.";

export const DEFAULT_OG_IMAGE = "/young-female-dentist-in-dental-office-dentist-at-2026-01-09-06-51-47-utc.jpg";

export const DEFAULT_KEYWORDS = [
  "freze dentare",
  "freze diamantate",
  "freze carbid",
  "freze FG",
  "freze RA",
  "freze HP",
  "consumabile stomatologice",
  "instrumente stomatologice",
  "frezedentare",
  "sebdental",
];

export const absoluteUrl = (path = "/") => new URL(path, SITE_URL).toString();

