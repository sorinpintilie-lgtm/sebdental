import { Product } from "@/lib/types";
import generatedProducts from "@/data/store-products.generated.json";

export const products: Product[] = generatedProducts as Product[];

export const getProductBySlug = (slug: string) => products.find((p) => p.slug === slug);

