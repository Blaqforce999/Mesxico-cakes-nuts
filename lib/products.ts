import { Product, ProductCategory } from '@/types/database';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-catalog';

export async function getProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
}): Promise<Product[]> {
  let products = [...INITIAL_PRODUCTS];
  if (options?.category) {
    products = products.filter((p) => p.category === options.category);
  }
  if (options?.featured !== undefined) {
    products = products.filter((p) => p.featured === options.featured);
  }
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return INITIAL_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
