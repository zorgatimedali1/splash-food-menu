import { requireAuth, isAuthError } from '../middleware/auth.js';
import { publicApiRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, publicCacheHeaders } from '../middleware/security.js';
import { formatResponse, formatPaginatedResponse, errorResponse, parsePagination } from '../utils/pagination.js';
import { cacheGet, cacheSet, flushCache, flushMultiple } from '../utils/cache.js';
import { processAndUploadImage } from '../utils/imageUpload.js';
import type { Env, Category } from '../types/index.js';

export const handleCategories = async (request: Request, env: Env, path: string, pathParts: string[]): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/categories
  if (path === '/api/categories' && method === 'GET') {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const cacheKey = 'categories:all';
    const cached = cacheGet<Category[]>(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);

    const { results } = await env.DB.prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count
       FROM categories c WHERE c.is_active = 1 ORDER BY c.sort_order ASC`
    ).all<Category & { product_count: number }>();

    cacheSet(cacheKey, results, 300);
    return jsonResponse(formatResponse(results), 200, publicCacheHeaders);
  }

  // GET /api/categories/:id
  if (pathParts.length === 3 && method === 'GET') {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const id = parseInt(pathParts[2], 10);
    const cacheKey = `categories:${id}`;
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);

    const category = await env.DB.prepare(
      `SELECT c.*, (SELECT COUNT(*) FROM products p WHERE p.category_id = c.id AND p.is_active = 1) as product_count
       FROM categories c WHERE c.id = ?`
    ).bind(id).first();

    if (!category) return jsonResponse(errorResponse('Category not found'), 404);
    cacheSet(cacheKey, category, 300);
    return jsonResponse(formatResponse(category), 200, publicCacheHeaders);
  }

  // POST /api/categories
  if (path === '/api/categories' && method === 'POST') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    try {
      const contentType = request.headers.get('Content-Type') || '';
      let name: string, description: string | null = null, sort_order = 0;
      let image_url: string | null = null;

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        name = formData.get('name') as string;
        description = formData.get('description') as string | null;
        sort_order = parseInt(formData.get('sort_order') as string || '0', 10);
        const imageFile = formData.get('image') as File | null;
        if (imageFile && imageFile.size > 0) {
          const variants = await processAndUploadImage(env, imageFile, 'categories');
          image_url = variants.web;
        }
      } else {
        const body = await request.json() as { name: string; description?: string; sort_order?: number };
        name = body.name;
        description = body.description || null;
        sort_order = body.sort_order || 0;
      }

      if (!name) return jsonResponse(errorResponse('Category name is required'), 400);

      const result = await env.DB.prepare(
        'INSERT INTO categories (name, description, image_url, sort_order) VALUES (?, ?, ?, ?) RETURNING *'
      ).bind(name.toUpperCase(), description, image_url, sort_order).first<Category>();

      flushMultiple('categories', 'stats');
      return jsonResponse(formatResponse(result), 201);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('UNIQUE')) return jsonResponse(errorResponse('Category name already exists'), 409);
      return jsonResponse(errorResponse('Failed to create category'), 500);
    }
  }

  // PUT /api/categories/reorder
  if (path === '/api/categories/reorder' && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const { orders } = await request.json() as { orders: { id: number; sort_order: number }[] };
    const updates = orders.map(({ id, sort_order }) =>
      env.DB.prepare('UPDATE categories SET sort_order = ? WHERE id = ?').bind(sort_order, id).run()
    );
    await Promise.all(updates);
    flushCache('categories');
    return jsonResponse(formatResponse({ message: 'Reordered successfully' }), 200);
  }

  // PUT /api/categories/:id
  if (pathParts.length === 3 && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const contentType = request.headers.get('Content-Type') || '';
    const fields: Record<string, unknown> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.get('name')) fields.name = (formData.get('name') as string).toUpperCase();
      if (formData.get('description') !== null) fields.description = formData.get('description');
      if (formData.get('sort_order')) fields.sort_order = parseInt(formData.get('sort_order') as string, 10);
      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const variants = await processAndUploadImage(env, imageFile, 'categories');
        fields.image_url = variants.web;
      }
      if (formData.get('remove_image') === '1') fields.image_url = null;
    } else {
      const body = await request.json() as Record<string, unknown>;
      if (body.name) fields.name = (body.name as string).toUpperCase();
      if (body.description !== undefined) fields.description = body.description;
      if (body.sort_order !== undefined) fields.sort_order = body.sort_order;
      if (body.is_active !== undefined) fields.is_active = body.is_active;
    }

    if (Object.keys(fields).length === 0) return jsonResponse(errorResponse('No fields to update'), 400);

    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(fields), id];
    const result = await env.DB.prepare(`UPDATE categories SET ${setClause} WHERE id = ? RETURNING *`).bind(...values).first<Category>();

    if (!result) return jsonResponse(errorResponse('Category not found'), 404);
    flushMultiple('categories', 'stats');
    return jsonResponse(formatResponse(result), 200);
  }

  // DELETE /api/categories/:id
  if (pathParts.length === 3 && method === 'DELETE') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const hard = url.searchParams.get('hard') === 'true';

    if (hard) {
      await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(id).run();
    } else {
      await env.DB.prepare('UPDATE categories SET is_active = 0 WHERE id = ?').bind(id).run();
    }

    flushMultiple('categories', 'products', 'stats');
    return jsonResponse(formatResponse({ message: 'Category deleted' }), 200);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
