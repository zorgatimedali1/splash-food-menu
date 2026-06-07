import { handleAuth } from './routes/auth.js';
import { handleCategories } from './routes/categories.js';
import { handleProducts } from './routes/products.js';
import { handleSupplements } from './routes/supplements.js';
import { handleOrders } from './routes/orders.js';
import { handleContact } from './routes/contact.js';
import { handleStats } from './routes/stats.js';
import { handleSettings } from './routes/settings.js';
import { jsonResponse } from './middleware/security.js';
import type { Env } from './types/index.js';

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'https://splashfood.tn',
  'https://www.splashfood.tn',
  'https://splash-food-menu.pages.dev',
  'https://splashfood-dashboard.pages.dev',
];

const getCorsHeaders = (origin: string | null): Record<string, string> => {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const origin = request.headers.get('Origin');
    const corsHeaders = getCorsHeaders(origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Add CORS to all responses (compression handled automatically by Cloudflare edge)
    const withCors = (response: Response): Response => {
      const newHeaders = new Headers(response.headers);
      Object.entries(corsHeaders).forEach(([k, v]) => newHeaders.set(k, v));
      return new Response(response.body, { status: response.status, headers: newHeaders });
    };

    if (!path.startsWith('/api/')) {
      return withCors(jsonResponse({ error: false, data: { message: 'Splash Food API', version: '1.0.0' } }));
    }

    const pathParts = path.split('/').filter(Boolean); // ['api', 'resource', ':id', ...]

    try {
      let response: Response;

      if (path.startsWith('/api/auth')) {
        response = await handleAuth(request, env, path);
      } else if (path.startsWith('/api/categories')) {
        response = await handleCategories(request, env, path, pathParts);
      } else if (path.startsWith('/api/products')) {
        response = await handleProducts(request, env, path, pathParts);
      } else if (path.startsWith('/api/supplements')) {
        response = await handleSupplements(request, env, path, pathParts);
      } else if (path.startsWith('/api/orders')) {
        response = await handleOrders(request, env, path, pathParts);
      } else if (path.startsWith('/api/contact')) {
        response = await handleContact(request, env, path, pathParts);
      } else if (path.startsWith('/api/stats')) {
        response = await handleStats(request, env, path);
      } else if (path.startsWith('/api/settings')) {
        response = await handleSettings(request, env, path);
      } else {
        response = jsonResponse({ error: true, message: 'Endpoint not found' }, 404);
      }

      return withCors(response);
    } catch (error) {
      console.error('Worker error:', error);
      return withCors(jsonResponse({ error: true, message: 'Internal server error' }, 500));
    }
  },
};
