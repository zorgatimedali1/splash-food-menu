const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000';

export function imageUrl(path: string | null | undefined): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${FRONTEND_URL}${path}`;
}
