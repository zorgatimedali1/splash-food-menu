import { requireAuth, isAuthError } from '../middleware/auth.js';
import { publicApiRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, publicCacheHeaders } from '../middleware/security.js';
import { formatResponse, errorResponse } from '../utils/pagination.js';
import { cacheGet, cacheSet, flushCache } from '../utils/cache.js';
import type { Env, Supplement } from '../types/index.js';

export const handleSupplements = async (request: Request, env: Env, path: string, pathParts: string[]): Promise<Response> => {
  const method = request.method;

  // GET /api/supplements
  if (path === '/api/supplements' && method === 'GET') {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const url = new URL(request.url);
    const all = url.searchParams.get('all') === 'true';

    const cacheKey = `supplements:${all ? 'all' : 'active'}`;
    const cached = cacheGet<Supplement[]>(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, all ? undefined : publicCacheHeaders);

    const where = all ? '1=1' : 'is_active = 1';
    const { results } = await env.DB.prepare(`SELECT * FROM supplements WHERE ${where} ORDER BY name ASC`).all<Supplement>();
    cacheSet(cacheKey, results, all ? 60 : 300);
    return jsonResponse(formatResponse(results), 200, all ? undefined : publicCacheHeaders);
  }

  // POST /api/supplements
  if (path === '/api/supplements' && method === 'POST') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const { name, price } = await request.json() as { name: string; price: number };
    if (!name || price === undefined) return jsonResponse(errorResponse('Name and price are required'), 400);

    try {
      const result = await env.DB.prepare(
        'INSERT INTO supplements (name, price) VALUES (?, ?) RETURNING *'
      ).bind(name, price).first<Supplement>();

      flushCache('supplements');
      return jsonResponse(formatResponse(result), 201);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('UNIQUE')) return jsonResponse(errorResponse('Supplement already exists'), 409);
      return jsonResponse(errorResponse('Failed to create supplement'), 500);
    }
  }

  // PUT /api/supplements/:id
  if (pathParts.length === 3 && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const body = await request.json() as { name?: string; price?: number; is_active?: number };
    const fields: Record<string, unknown> = {};

    if (body.name !== undefined) fields.name = body.name;
    if (body.price !== undefined) fields.price = body.price;
    if (body.is_active !== undefined) fields.is_active = body.is_active;

    if (Object.keys(fields).length === 0) return jsonResponse(errorResponse('No fields to update'), 400);

    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const result = await env.DB.prepare(`UPDATE supplements SET ${setClause} WHERE id = ? RETURNING *`)
      .bind(...Object.values(fields), id).first<Supplement>();

    if (!result) return jsonResponse(errorResponse('Supplement not found'), 404);
    flushCache('supplements');
    return jsonResponse(formatResponse(result), 200);
  }

  // DELETE /api/supplements/:id
  if (pathParts.length === 3 && method === 'DELETE') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    await env.DB.prepare('DELETE FROM supplements WHERE id = ?').bind(id).run();
    flushCache('supplements');
    return jsonResponse(formatResponse({ message: 'Supplement deleted' }), 200);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
