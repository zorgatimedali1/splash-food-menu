import { useState, useEffect } from 'react';
import { apiGet, type ProductDTO, type CategoryDTO, type SupplementDTO, type SettingsDTO } from '@/lib/api';

const CACHE_DURATION = 30 * 1000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_DURATION });
}

async function fetchWithCache<T>(key: string, path: string): Promise<T> {
  const cached = getCached<T>(key);
  if (cached) return cached;
  const data = await apiGet<T>(path);
  setCache(key, data);
  return data;
}

export function getProductSlug(category: string, name: string): string {
  return `${category}-${name}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function useFetchOnce<T>(key: string, path: string): { data: T; loading: boolean } {
  const [data, setData] = useState<T>([] as unknown as T);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const result = await fetchWithCache<T>(key, path);
        if (!cancelled) setData(result);
      } catch (e) {
        console.error(`Failed to fetch ${key}:`, e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [key, path]);

  return { data, loading };
}

export function useCategories() {
  const { data, loading } = useFetchOnce<CategoryDTO[]>('categories', '/api/categories');
  return { categories: data, loading };
}

export function useProducts() {
  const { data, loading } = useFetchOnce<ProductDTO[]>('products', '/api/products?limit=200');
  return { products: data, loading };
}

export function useBestSellers() {
  const { data, loading } = useFetchOnce<ProductDTO[]>('bestsellers', '/api/products?bestsellers=true');
  return { bestSellers: data, loading };
}

export function useSettings() {
  const { data, loading } = useFetchOnce<SettingsDTO | null>('settings', '/api/settings');
  return { settings: data, loading };
}

export function useSupplements() {
  const { data, loading } = useFetchOnce<SupplementDTO[]>('supplements', '/api/supplements');
  return { supplements: data, loading };
}

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all = await fetchWithCache<ProductDTO[]>('products', '/api/products?limit=200');
        const found = all.find((p) => getProductSlug(p.category_name, p.name) === slug);
        if (!cancelled) setProduct(found || null);
      } catch (e) {
        console.error('Failed to fetch product:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [slug]);

  return { product, loading };
}
