import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const STALE = 5 * 60 * 1000;   // 5 min
const CACHE = 10 * 60 * 1000;  // 10 min

// ─── Types ───────────────────────────────────────────────────────────────────
export interface Category {
  id: number; name: string; description: string | null;
  image_url: string | null; is_active: number; sort_order: number;
  created_at: string; product_count?: number;
}
export interface Product {
  id: number; category_id: number; name: string; description: string | null;
  price: number; image_url: string | null; is_active: number; is_bestseller: number; sort_order: number;
  created_at: string; updated_at: string; category_name?: string;
}
export interface Supplement {
  id: number; name: string; price: number; is_active: number;
}
export interface Order {
  id: number; customer_name: string | null; customer_address: string | null;
  customer_phone: string | null; items: string; total: number | null;
  delivery_fee: number | null; status: string; notes: string | null; created_at: string;
}
export interface ContactMessage {
  id: number; name: string; email: string; subject: string | null;
  message: string; is_read: number; created_at: string;
}
export interface Stats {
  total_orders: number; total_revenue: number; active_products: number;
  total_categories: number; pending_orders: number;
}
export interface PaginatedResponse<T> {
  error: false; data: T[]; total: number; page: number; limit: number; totalPages: number;
}
export interface SingleResponse<T> { error: false; data: T; }

// ─── Categories ──────────────────────────────────────────────────────────────
export const useCategories = () =>
  useQuery<SingleResponse<Category[]>>({
    queryKey: ['categories'],
    queryFn: () => api.get('/api/categories'),
    staleTime: STALE, gcTime: CACHE,
  });

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.postForm<SingleResponse<Category>>('/api/categories', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

export const useUpdateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) => api.putForm<SingleResponse<Category>>(`/api/categories/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); },
  });
};

export const useDeleteCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/categories/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

// ─── Products ────────────────────────────────────────────────────────────────
export const useProducts = (params?: { category?: string; search?: string; page?: number; limit?: number }) => {
  const qs = new URLSearchParams();
  qs.set('all', 'true');
  if (params?.category) qs.set('category', params.category);
  if (params?.search) qs.set('search', params.search);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit));
  const query = qs.toString();
  return useQuery<PaginatedResponse<Product>>({
    queryKey: ['products', params],
    queryFn: () => api.get(`/api/products${query ? '?' + query : ''}`),
    staleTime: STALE, gcTime: CACHE,
  });
};

export const useCreateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (form: FormData) => api.postForm<SingleResponse<Product>>('/api/products', form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['categories'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

export const useUpdateProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, form }: { id: number; form: FormData }) => api.putForm<SingleResponse<Product>>(`/api/products/${id}`, form),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); },
  });
};

export const useToggleProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/products/${id}/toggle`, {}),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const prev = qc.getQueriesData<PaginatedResponse<Product>>({ queryKey: ['products'] });
      qc.setQueriesData({ queryKey: ['products'] }, (old: PaginatedResponse<Product> | undefined) => {
        if (!old) return old;
        return { ...old, data: old.data.map(p => p.id === id ? { ...p, is_active: p.is_active ? 0 : 1 } : p) };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => { ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data)); },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

export const useToggleBestseller = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/products/${id}/bestseller`, {}),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['products'] });
      const prev = qc.getQueriesData<PaginatedResponse<Product>>({ queryKey: ['products'] });
      qc.setQueriesData({ queryKey: ['products'] }, (old: PaginatedResponse<Product> | undefined) => {
        if (!old) return old;
        return { ...old, data: old.data.map(p => p.id === id ? { ...p, is_bestseller: p.is_bestseller ? 0 : 1 } : p) };
      });
      return { prev };
    },
    onError: (_err, _id, ctx) => { ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data)); },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['products'] }); },
  });
};

export const useDeleteProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/products/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['products'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

// ─── Supplements ─────────────────────────────────────────────────────────────
export const useSupplements = () =>
  useQuery<SingleResponse<Supplement[]>>({
    queryKey: ['supplements'],
    queryFn: () => api.get('/api/supplements?all=true'),
    staleTime: STALE, gcTime: CACHE,
  });

export const useCreateSupplement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; price: number }) => api.post<SingleResponse<Supplement>>('/api/supplements', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplements'] }),
  });
};

export const useUpdateSupplement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number; name?: string; price?: number; is_active?: number }) =>
      api.put<SingleResponse<Supplement>>(`/api/supplements/${id}`, data),
    onMutate: async ({ id, is_active }) => {
      if (is_active === undefined) return;
      await qc.cancelQueries({ queryKey: ['supplements'] });
      const prev = qc.getQueriesData<SingleResponse<Supplement[]>>({ queryKey: ['supplements'] });
      qc.setQueriesData({ queryKey: ['supplements'] }, (old: SingleResponse<Supplement[]> | undefined) => {
        if (!old) return old;
        return { ...old, data: old.data.map(s => s.id === id ? { ...s, is_active } : s) };
      });
      return { prev };
    },
    onError: (_err, _vars, ctx) => { ctx?.prev.forEach(([key, data]) => qc.setQueryData(key, data)); },
    onSettled: () => qc.invalidateQueries({ queryKey: ['supplements'] }),
  });
};

export const useDeleteSupplement = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/supplements/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['supplements'] }),
  });
};

// ─── Orders ──────────────────────────────────────────────────────────────────
export const useOrders = (params?: { status?: string; from?: string; to?: string; page?: number; limit?: number }) => {
  const qs = new URLSearchParams();
  if (params?.status) qs.set('status', params.status);
  if (params?.from) qs.set('from', params.from);
  if (params?.to) qs.set('to', params.to);
  if (params?.page) qs.set('page', String(params.page));
  if (params?.limit) qs.set('limit', String(params.limit || 50));
  const query = qs.toString();
  return useQuery<PaginatedResponse<Order>>({
    queryKey: ['orders', params],
    queryFn: () => api.get(`/api/orders${query ? '?' + query : ''}`),
    staleTime: 60_000, gcTime: 120_000,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateOrderStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      api.put(`/api/orders/${id}/status`, { status }),
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ['orders'] });
      const snapshots = qc.getQueriesData<PaginatedResponse<Order>>({ queryKey: ['orders'] });
      qc.setQueriesData({ queryKey: ['orders'] }, (old: PaginatedResponse<Order> | undefined) => {
        if (!old) return old;
        return { ...old, data: old.data.map(o => o.id === id ? { ...o, status } : o) };
      });
      return { snapshots };
    },
    onError: (_err, _vars, ctx) => {
      ctx?.snapshots.forEach(([key, data]) => qc.setQueryData(key, data));
    },
    onSettled: () => { qc.invalidateQueries({ queryKey: ['orders'] }); qc.invalidateQueries({ queryKey: ['stats'] }); },
  });
};

// ─── Contact Messages ────────────────────────────────────────────────────────
export const useMessages = (params?: { is_read?: number; page?: number }) => {
  const qs = new URLSearchParams();
  if (params?.is_read !== undefined) qs.set('is_read', String(params.is_read));
  if (params?.page) qs.set('page', String(params.page));
  qs.set('limit', '20');
  return useQuery<PaginatedResponse<ContactMessage>>({
    queryKey: ['messages', params],
    queryFn: () => api.get(`/api/contact?${qs.toString()}`),
    staleTime: 60_000,
  });
};

export const useMarkMessageRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.put(`/api/contact/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
};

export const useDeleteMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/contact/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['messages'] }),
  });
};

// ─── Stats ───────────────────────────────────────────────────────────────────
export const useStats = () =>
  useQuery<SingleResponse<Stats>>({
    queryKey: ['stats'],
    queryFn: () => api.get('/api/stats/overview'),
    staleTime: 2 * 60_000,
    refetchOnWindowFocus: true,
  });

export const useRevenueStats = (period = 'daily') =>
  useQuery<SingleResponse<{ date: string; revenue: number; order_count: number }[]>>({
    queryKey: ['stats', 'revenue', period],
    queryFn: () => api.get(`/api/stats/revenue?period=${period}`),
    staleTime: 5 * 60_000,
  });

export const useTopProducts = () =>
  useQuery<SingleResponse<{ name: string; category: string; order_count: number; total_revenue: number }[]>>({
    queryKey: ['stats', 'top-products'],
    queryFn: () => api.get('/api/stats/top-products'),
    staleTime: 5 * 60_000,
  });

export const useRecentOrders = () =>
  useQuery<SingleResponse<Order[]>>({
    queryKey: ['stats', 'recent-orders'],
    queryFn: () => api.get('/api/stats/recent-orders'),
    staleTime: 60_000,
    refetchOnWindowFocus: true,
  });

// ─── Settings ────────────────────────────────────────────────────────────────
export const useSettings = () =>
  useQuery<SingleResponse<Record<string, string>>>({
    queryKey: ['settings'],
    queryFn: () => api.get('/api/settings'),
    staleTime: 10 * 60_000,
  });

export const useUpdateSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, string>) => api.put('/api/settings', data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['settings'] }),
  });
};
