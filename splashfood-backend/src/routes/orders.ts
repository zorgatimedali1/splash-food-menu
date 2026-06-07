import { requireAuth, isAuthError } from '../middleware/auth.js';
import { orderRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, privateCacheHeaders } from '../middleware/security.js';
import { formatResponse, formatPaginatedResponse, errorResponse, parsePagination } from '../utils/pagination.js';
import { flushMultiple } from '../utils/cache.js';
import type { Env, Order } from '../types/index.js';

export const handleOrders = async (request: Request, env: Env, path: string, pathParts: string[]): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);

  // POST /api/orders - Public
  if (path === '/api/orders' && method === 'POST') {
    const limited = orderRateLimit(request);
    if (limited) return limited;

    try {
      const body = await request.json() as {
        customer_name?: string;
        customer_address?: string;
        customer_phone?: string;
        items: unknown;
        total?: number;
        delivery_fee?: number;
        notes?: string;
      };

      if (!body.items) return jsonResponse(errorResponse('Order items are required'), 400);

      const items = typeof body.items === 'string' ? body.items : JSON.stringify(body.items);

      // Recalculate total server-side to prevent client-side manipulation.
      // Parse items, look up prices from DB, and add delivery fee.
      let serverTotal: number | null = null;
      try {
        const parsed: { product_id?: number; quantity?: number; price?: number; supplements?: { price: number }[] }[] =
          JSON.parse(typeof body.items === 'string' ? body.items : JSON.stringify(body.items));

        if (Array.isArray(parsed) && parsed.length > 0) {
          let sum = 0;
          for (const item of parsed) {
            if (item.product_id) {
              const dbProduct = await env.DB.prepare('SELECT price FROM products WHERE id = ? AND is_active = 1')
                .bind(item.product_id).first<{ price: number }>();
              if (dbProduct) {
                const qty = Math.max(1, Math.floor(item.quantity ?? 1));
                const suppTotal = Array.isArray(item.supplements)
                  ? item.supplements.reduce((s, sup) => s + (sup.price || 0), 0)
                  : 0;
                sum += (dbProduct.price + suppTotal) * qty;
              }
            }
          }
          if (sum > 0) {
            const deliveryFee = Number(body.delivery_fee) || 2;
            serverTotal = Math.round((sum + deliveryFee) * 100) / 100;
          }
        }
      } catch {
        // If parsing fails, fall back to client total (better than rejecting the order)
      }

      const result = await env.DB.prepare(
        `INSERT INTO orders (customer_name, customer_address, customer_phone, items, total, delivery_fee, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING *`
      ).bind(
        body.customer_name || null,
        body.customer_address || null,
        body.customer_phone || null,
        items,
        serverTotal ?? body.total ?? null,
        body.delivery_fee || null,
        body.notes || null
      ).first<Order>();

      flushMultiple('orders', 'stats');
      return jsonResponse(formatResponse(result), 201);
    } catch {
      return jsonResponse(errorResponse('Failed to submit order'), 500);
    }
  }

  // GET /api/orders - Admin
  if (path === '/api/orders' && method === 'GET') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const { page, limit, offset } = parsePagination(url);
    const status = url.searchParams.get('status');
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');

    let where = '1=1';
    const params: unknown[] = [];

    if (status) { where += ' AND status = ?'; params.push(status); }
    if (from) { where += ' AND created_at >= ?'; params.push(from); }
    if (to) { where += ' AND created_at <= ?'; params.push(to + 'T23:59:59'); }

    const [countResult, { results }] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as total FROM orders WHERE ${where}`).bind(...params).first<{ total: number }>(),
      env.DB.prepare(`SELECT * FROM orders WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .bind(...params, limit, offset).all<Order>(),
    ]);

    return jsonResponse(formatPaginatedResponse(results, countResult?.total || 0, page, limit), 200, privateCacheHeaders);
  }

  // GET /api/orders/:id - Admin
  if (pathParts.length === 3 && method === 'GET') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    if (isNaN(id)) return jsonResponse(errorResponse('Invalid order ID'), 400);

    const order = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<Order>();
    if (!order) return jsonResponse(errorResponse('Order not found'), 404);

    // Parse items JSON if string
    const parsedOrder = {
      ...order,
      items: typeof order.items === 'string' ? JSON.parse(order.items) : order.items,
    };

    return jsonResponse(formatResponse(parsedOrder), 200, privateCacheHeaders);
  }

  // PUT /api/orders/:id/status - Admin
  if (pathParts.length === 4 && pathParts[3] === 'status' && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const { status } = await request.json() as { status: string };
    const validStatuses = ['pending', 'preparing', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return jsonResponse(errorResponse('Invalid status. Must be one of: ' + validStatuses.join(', ')), 400);
    }

    const result = await env.DB.prepare('UPDATE orders SET status = ? WHERE id = ? RETURNING *')
      .bind(status, id).first<Order>();

    if (!result) return jsonResponse(errorResponse('Order not found'), 404);
    flushMultiple('orders', 'stats');
    return jsonResponse(formatResponse(result), 200);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
