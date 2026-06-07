import { api } from './api';

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  role: string;
}

export const login = async (email: string, password: string): Promise<{ token: string; user: AuthUser }> => {
  const res = await api.post<{ error: false; data: { token: string; user: AuthUser } }>(
    '/api/auth/login', { email, password }
  );
  localStorage.setItem('sf_token', res.data.token);
  localStorage.setItem('sf_user', JSON.stringify(res.data.user));
  return res.data;
};

export const logout = async () => {
  try { await api.post('/api/auth/logout', {}); } catch {}
  localStorage.removeItem('sf_token');
  localStorage.removeItem('sf_user');
};

export const getToken = (): string | null => localStorage.getItem('sf_token');
export const isAuthenticated = (): boolean => !!getToken();
export const getUser = (): AuthUser | null => {
  const u = localStorage.getItem('sf_user');
  return u ? JSON.parse(u) : null;
};
