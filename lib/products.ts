import { createClient } from '@/lib/supabase/server';
import { Product, ProductCategory } from '@/types/database';
import { INITIAL_PRODUCTS } from '@/lib/data/mock-catalog';

export async function getProducts(options?: {
  category?: ProductCategory;
  featured?: boolean;
}): Promise<Product[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from('products').select('*').eq('is_active', true);

    if (options?.category) {
      query = query.eq('category', options.category);
    }
    if (options?.featured !== undefined) {
      query = query.eq('featured', options.featured);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      // Return filtered mock products if database is not reachable yet
      let fallback = [...INITIAL_PRODUCTS];
      if (options?.category) {
        fallback = fallback.filter((p) => p.category === options.category);
      }
      if (options?.featured !== undefined) {
        fallback = fallback.filter((p) => p.featured === options.featured);
      }
      return fallback;
    }

    return data as Product[];
  } catch {
    let fallback = [...INITIAL_PRODUCTS];
    if (options?.category) {
      fallback = fallback.filter((p) => p.category === options.category);
    }
    if (options?.featured !== undefined) {
      fallback = fallback.filter((p) => p.featured === options.featured);
    }
    return fallback;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !data) {
      const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
      return fallback ?? null;
    }

    return data as Product;
  } catch {
    const fallback = INITIAL_PRODUCTS.find((p) => p.slug === slug);
    return fallback ?? null;
  }
}
