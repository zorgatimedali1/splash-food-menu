const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(data.message || 'API request failed');
  }
  return data.data;
}

export interface ProductDTO {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: number;
  is_bestseller: number;
  sort_order: number;
  category_name: string;
}

export interface CategoryDTO {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: number;
  sort_order: number;
  product_count: number;
}

export interface SupplementDTO {
  id: number;
  name: string;
  price: number;
  is_active: number;
}

export interface SettingsDTO {
  whatsapp_number: string;
  delivery_fee: string;
  restaurant_address: string;
  opening_hours: string;
}
