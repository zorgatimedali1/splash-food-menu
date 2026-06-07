const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8787';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const getHeaders = (isFormData = false): Record<string, string> => {
  const token = localStorage.getItem('sf_token');
  const headers: Record<string, string> = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

const request = async <T>(
  method: string,
  path: string,
  body?: unknown,
  isFormData = false
): Promise<T> => {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: getHeaders(isFormData),
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new ApiError(res.status, data.message || 'Request failed');
  }
  return data;
};

export const api = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  postForm: <T>(path: string, form: FormData) => request<T>('POST', path, form, true),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  putForm: <T>(path: string, form: FormData) => request<T>('PUT', path, form, true),
  delete: <T>(path: string) => request<T>('DELETE', path),
};
