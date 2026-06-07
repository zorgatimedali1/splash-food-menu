import { requireAuth, isAuthError } from '../middleware/auth.js';
import { publicApiRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, publicCacheHeaders } from '../middleware/security.js';
import { formatResponse, formatPaginatedResponse, errorResponse, parsePagination } from '../utils/pagination.js';
import { cacheGet, cacheSet, flushMultiple } from '../utils/cache.js';
import { processAndUploadImage } from '../utils/imageUpload.js';
import type { Env, Product } from '../types/index.js';

export const handleProducts = async (request: Request, env: Env, path: string, pathParts: string[]): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/products
  if (path === '/api/products' && method === 'GET') {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const { page, limit, offset } = parsePagination(url);
    const category = url.searchParams.get('category');
    const search = url.searchParams.get('search');
    const bestsellers = url.searchParams.get('bestsellers') === 'true';
    const all = url.searchParams.get('all') === 'true';

    const cacheKey = `products:${category}:${search}:${bestsellers}:${all}:${page}:${limit}`;
    const cached = !all ? cacheGet(cacheKey) : null;
    if (cached) return jsonResponse(cached, 200, publicCacheHeaders);

    let where = all ? '1=1' : 'p.is_active = 1';
    const params: unknown[] = [];

    if (category) {
      where += ' AND UPPER(c.name) = UPPER(?)';
      params.push(category);
    }
    if (search) {
      where += ' AND (p.name LIKE ? OR p.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    if (bestsellers) {
      where += ' AND p.is_bestseller = 1';
    }

    const [countResult, { results }] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as total FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE ${where}`)
        .bind(...params).first<{ total: number }>(),
      env.DB.prepare(
        `SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE ${where} ORDER BY p.sort_order ASC, p.id ASC LIMIT ? OFFSET ?`
      ).bind(...params, limit, offset).all<Product>(),
    ]);

    const total = countResult?.total || 0;
    const response = formatPaginatedResponse(results, total, page, limit);
    if (!all) cacheSet(cacheKey, response, 180);
    return jsonResponse(response, 200, all ? undefined : publicCacheHeaders);
  }

  // GET /api/products/:id
  if (pathParts.length === 3 && method === 'GET' && !['toggle'].includes(pathParts[2])) {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const id = parseInt(pathParts[2], 10);
    if (isNaN(id)) return jsonResponse(errorResponse('Invalid product ID'), 400);

    const cacheKey = `products:single:${id}`;
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);

    const [product, { results: supplements }] = await Promise.all([
      env.DB.prepare(
        `SELECT p.*, c.name as category_name FROM products p
         LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = ?`
      ).bind(id).first<Product>(),
      env.DB.prepare('SELECT * FROM supplements WHERE is_active = 1').all(),
    ]);

    if (!product) return jsonResponse(errorResponse('Product not found'), 404);

    const data = { ...product, supplements };
    cacheSet(cacheKey, data, 180);
    return jsonResponse(formatResponse(data), 200, publicCacheHeaders);
  }

  // POST /api/products
  if (path === '/api/products' && method === 'POST') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    try {
      const contentType = request.headers.get('Content-Type') || '';
      let name: string, description: string | null = null, price: number, category_id: number, sort_order = 0;
      let image_url: string | null = null;

      if (contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        name = formData.get('name') as string;
        description = formData.get('description') as string | null;
        price = parseFloat(formData.get('price') as string);
        category_id = parseInt(formData.get('category_id') as string, 10);
        sort_order = parseInt(formData.get('sort_order') as string || '0', 10);

        const imageFile = formData.get('image') as File | null;
        if (imageFile && imageFile.size > 0) {
          const variants = await processAndUploadImage(env, imageFile, 'products');
          image_url = variants.web;
        }
      } else {
        const body = await request.json() as { name: string; description?: string; price: number; category_id: number; sort_order?: number };
        name = body.name;
        description = body.description || null;
        price = body.price;
        category_id = body.category_id;
        sort_order = body.sort_order || 0;
      }

      if (!name || !price || !category_id) return jsonResponse(errorResponse('Name, price, and category_id are required'), 400);

      const result = await env.DB.prepare(
        'INSERT INTO products (category_id, name, description, price, image_url, sort_order) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
      ).bind(category_id, name, description, price, image_url, sort_order).first<Product>();

      flushMultiple('products', 'categories', 'stats');
      return jsonResponse(formatResponse(result), 201);
    } catch {
      return jsonResponse(errorResponse('Failed to create product'), 500);
    }
  }

  // PUT /api/products/:id/toggle
  if (pathParts.length === 4 && pathParts[3] === 'toggle' && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const product = await env.DB.prepare('SELECT is_active FROM products WHERE id = ?').bind(id).first<{ is_active: number }>();
    if (!product) return jsonResponse(errorResponse('Product not found'), 404);

    const newActive = product.is_active ? 0 : 1;
    await env.DB.prepare('UPDATE products SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newActive, id).run();

    flushMultiple('products', 'stats');
    return jsonResponse(formatResponse({ is_active: newActive }), 200);
  }

  // PUT /api/products/:id/bestseller
  if (pathParts.length === 4 && pathParts[3] === 'bestseller' && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const product = await env.DB.prepare('SELECT is_bestseller FROM products WHERE id = ?').bind(id).first<{ is_bestseller: number }>();
    if (!product) return jsonResponse(errorResponse('Product not found'), 404);

    const newBestseller = product.is_bestseller ? 0 : 1;

    if (newBestseller) {
      const { count } = (await env.DB.prepare(
        'SELECT COUNT(*) as count FROM products WHERE is_bestseller = 1 AND id != ?'
      ).bind(id).first<{ count: number }>())!;
      if (count >= 4) return jsonResponse(errorResponse('Maximum 4 best-sellers autorisés'), 400);
    }

    await env.DB.prepare('UPDATE products SET is_bestseller = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(newBestseller, id).run();

    flushMultiple('products', 'stats');
    return jsonResponse(formatResponse({ is_bestseller: newBestseller }), 200);
  }

  // PUT /api/products/:id
  if (pathParts.length === 3 && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    if (isNaN(id)) return jsonResponse(errorResponse('Invalid product ID'), 400);

    const contentType = request.headers.get('Content-Type') || '';
    // Whitelist prevents arbitrary column names from reaching the SQL SET clause
    const ALLOWED_PRODUCT_FIELDS = new Set(['name', 'description', 'price', 'category_id', 'sort_order', 'is_active', 'image_url', 'updated_at']);
    const fields: Record<string, unknown> = {};

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      if (formData.get('name')) fields.name = formData.get('name');
      if (formData.get('description') !== null) fields.description = formData.get('description');
      if (formData.get('price')) fields.price = parseFloat(formData.get('price') as string);
      if (formData.get('category_id')) fields.category_id = parseInt(formData.get('category_id') as string, 10);
      if (formData.get('sort_order')) fields.sort_order = parseInt(formData.get('sort_order') as string, 10);
      if (formData.get('is_active') !== null) fields.is_active = parseInt(formData.get('is_active') as string, 10);
      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        const variants = await processAndUploadImage(env, imageFile, 'products');
        fields.image_url = variants.web;
      }
      if (formData.get('remove_image') === '1') fields.image_url = null;
    } else {
      const body = await request.json() as Record<string, unknown>;
      const allowed = ['name', 'description', 'price', 'category_id', 'sort_order', 'is_active', 'image_url'];
      allowed.forEach(k => { if (body[k] !== undefined) fields[k] = body[k]; });
    }

    if (Object.keys(fields).length === 0) return jsonResponse(errorResponse('No fields to update'), 400);

    fields.updated_at = new Date().toISOString();

    // Validate all keys are whitelisted before building SQL
    for (const k of Object.keys(fields)) {
      if (!ALLOWED_PRODUCT_FIELDS.has(k)) return jsonResponse(errorResponse(`Invalid field: ${k}`), 400);
    }

    const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(fields), id];
    const result = await env.DB.prepare(`UPDATE products SET ${setClause} WHERE id = ? RETURNING *`).bind(...values).first<Product>();

    if (!result) return jsonResponse(errorResponse('Product not found'), 404);
    flushMultiple('products', 'categories', 'stats');
    return jsonResponse(formatResponse(result), 200);
  }

  // DELETE /api/products/:id
  if (pathParts.length === 3 && method === 'DELETE') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const hard = url.searchParams.get('hard') === 'true';

    if (hard) {
      await env.DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
    } else {
      await env.DB.prepare('UPDATE products SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(id).run();
    }

    flushMultiple('products', 'categories', 'stats');
    return jsonResponse(formatResponse({ message: 'Product deleted' }), 200);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
