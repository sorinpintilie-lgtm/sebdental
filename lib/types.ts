export type ShankType = "FG" | "RA" | "HP";

export type MaterialType = "Carbid" | "Diamant" | "Ceramică";

export type StockStatus = "in_stock" | "low_stock" | "backorder";

export interface Brand {
  id: string;
  slug: string;
  name: string;
  origin: string;
  short: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  image: string;
  colorCode: string;
  priceLei: number;
  brand: string;
  sku: string;
  isoCode: string;
  shank: ShankType;
  material: MaterialType;
  application: string[];
  grit: string;
  shape: string;
  diameterMm: number;
  recommendedRpm: string;
  coating?: string;
  stockStatus: StockStatus;
  isNew: boolean;
  isBestseller: boolean;
  rating: number;
  reviewCount: number;
  bulletsShort: string[];
  specs: Record<string, string>;
  warnings: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  sections: {
    heading: string;
    bullets: string[];
  }[];
}

