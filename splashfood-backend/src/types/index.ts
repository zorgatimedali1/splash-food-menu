export interface Env {
  DB: D1Database;
  R2: R2Bucket;
  JWT_SECRET: string;
  R2_PUBLIC_URL: string;
  FRONTEND_ORIGIN: string;
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string | null;
  image_url: string | null;
  is_active: number;
  sort_order: number;
  created_at: string;
}

export interface Product {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_active: number;
  is_bestseller: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  category_name?: string;
}

export interface Supplement {
  id: number;
  name: string;
  price: number;
  is_active: number;
}

export interface OrderItem {
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
  supplements?: { name: string; price: number }[];
  instructions?: string;
}

export interface Order {
  id: number;
  customer_name: string | null;
  customer_address: string | null;
  customer_phone: string | null;
  items: string;
  total: number | null;
  delivery_fee: number | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: number;
  created_at: string;
}

export interface SiteSetting {
  key: string;
  value: string | null;
  updated_at: string;
}

export interface JWTPayload {
  sub: number;
  email: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface PaginatedResponse<T> {
  error: false;
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SingleResponse<T> {
  error: false;
  data: T;
}

export interface ErrorResponse {
  error: true;
  message: string;
}
