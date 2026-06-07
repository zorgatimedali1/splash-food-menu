import { useState, useEffect } from 'react';
import { apiGet, type ProductDTO, type CategoryDTO, type SupplementDTO, type SettingsDTO } from '@/lib/api';

const CACHE_DURATION = 5 * 60 * 1000;

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

let categoriesPromise: Promise<CategoryDTO[]> | null = null;
let productsPromise: Promise<ProductDTO[]> | null = null;
let supplementsPromise: Promise<SupplementDTO[]> | null = null;
let settingsPromise: Promise<SettingsDTO> | null = null;

export function getProductSlug(category: string, name: string): string {
  return `${category}-${name}`
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!categoriesPromise) {
          categoriesPromise = fetchWithCache<CategoryDTO[]>('categories', '/api/categories');
        }
        const data = await categoriesPromise;
        if (!cancelled) setCategories(data);
      } catch (e) {
        console.error('Failed to fetch categories:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
}

export function useProducts() {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!productsPromise) {
          productsPromise = fetchWithCache<ProductDTO[]>('products', '/api/products?limit=200');
        }
        const data = await productsPromise;
        if (!cancelled) setProducts(data);
      } catch (e) {
        console.error('Failed to fetch products:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { products, loading };
}

export function useSettings() {
  const [settings, setSettings] = useState<SettingsDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!settingsPromise) {
          settingsPromise = fetchWithCache<SettingsDTO>('settings', '/api/settings');
        }
        const data = await settingsPromise;
        if (!cancelled) setSettings(data);
      } catch (e) {
        console.error('Failed to fetch settings:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { settings, loading };
}

export function useSupplements() {
  const [supplements, setSupplements] = useState<SupplementDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!supplementsPromise) {
          supplementsPromise = fetchWithCache<SupplementDTO[]>('supplements', '/api/supplements');
        }
        const data = await supplementsPromise;
        if (!cancelled) setSupplements(data);
      } catch (e) {
        console.error('Failed to fetch supplements:', e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { supplements, loading };
}

export function useProductBySlug(slug: string) {
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (!productsPromise) {
          productsPromise = fetchWithCache<ProductDTO[]>('products', '/api/products?limit=200');
        }
        const all = await productsPromise;
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
