import { requireAuth, isAuthError } from '../middleware/auth.js';
import { adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, privateCacheHeaders } from '../middleware/security.js';
import { formatResponse, errorResponse } from '../utils/pagination.js';
import { cacheGet, cacheSet } from '../utils/cache.js';
import type { Env } from '../types/index.js';

export const handleStats = async (request: Request, env: Env, path: string): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);

  if (method !== 'GET') return jsonResponse(errorResponse('Method not allowed'), 405);

  const limited = adminRateLimit(request);
  if (limited) return limited;
  const auth = await requireAuth(request, env);
  if (isAuthError(auth)) return auth;

  // GET /api/stats/overview
  if (path === '/api/stats/overview') {
    const cacheKey = 'stats:overview';
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);

    const [orders, revenue, products, categories, pending] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as count FROM orders').first<{ count: number }>(),
      env.DB.prepare("SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE status != 'cancelled'").first<{ total: number }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').first<{ count: number }>(),
      env.DB.prepare('SELECT COUNT(*) as count FROM categories WHERE is_active = 1').first<{ count: number }>(),
      env.DB.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").first<{ count: number }>(),
    ]);

    const data = {
      total_orders: orders?.count || 0,
      total_revenue: revenue?.total || 0,
      active_products: products?.count || 0,
      total_categories: categories?.count || 0,
      pending_orders: pending?.count || 0,
    };

    cacheSet(cacheKey, data, 120);
    return jsonResponse(formatResponse(data), 200, privateCacheHeaders);
  }

  // GET /api/stats/revenue
  if (path === '/api/stats/revenue') {
    const period = url.searchParams.get('period') || 'daily';
    const from = url.searchParams.get('from') || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const to = url.searchParams.get('to') || new Date().toISOString().split('T')[0];

    const cacheKey = `stats:revenue:${period}:${from}:${to}`;
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);

    let dateFormat: string;
    if (period === 'monthly') dateFormat = '%Y-%m';
    else if (period === 'weekly') dateFormat = '%Y-W%W';
    else dateFormat = '%Y-%m-%d';

    const { results } = await env.DB.prepare(
      `SELECT strftime('${dateFormat}', created_at) as date,
              COALESCE(SUM(total), 0) as revenue,
              COUNT(*) as order_count
       FROM orders
       WHERE created_at >= ? AND created_at <= ?
         AND status != 'cancelled'
       GROUP BY date
       ORDER BY date ASC`
    ).bind(from, to + 'T23:59:59').all();

    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }

  // GET /api/stats/top-products
  if (path === '/api/stats/top-products') {
    const cacheKey = 'stats:top-products';
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, privateCacheHeaders);

    // Use JSON-safe boundary matching: product IDs in the items JSON are always
    // preceded by `"product_id":` so we match that exact pattern to avoid
    // false positives (e.g. id=1 matching inside id=10 or id=11).
    const { results } = await env.DB.prepare(
      `SELECT p.id, p.name, c.name as category, p.price,
              COUNT(o.id) as order_count,
              COUNT(o.id) * p.price as total_revenue
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN orders o ON o.items LIKE '%"product_id":' || p.id || ',%'
                          OR o.items LIKE '%"product_id":' || p.id || '}'
                          OR o.items LIKE '%"product_id":' || p.id || ' %'
       WHERE p.is_active = 1
       GROUP BY p.id
       ORDER BY order_count DESC
       LIMIT 10`
    ).all();

    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }

  // GET /api/stats/recent-orders
  if (path === '/api/stats/recent-orders') {
    const { results } = await env.DB.prepare(
      'SELECT id, customer_name, customer_phone, total, status, created_at FROM orders ORDER BY created_at DESC LIMIT 20'
    ).all();

    return jsonResponse(formatResponse(results), 200, privateCacheHeaders);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
