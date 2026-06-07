import { requireAuth, isAuthError } from '../middleware/auth.js';
import { contactRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, privateCacheHeaders } from '../middleware/security.js';
import { formatResponse, formatPaginatedResponse, errorResponse, parsePagination } from '../utils/pagination.js';
import type { Env, ContactMessage } from '../types/index.js';

export const handleContact = async (request: Request, env: Env, path: string, pathParts: string[]): Promise<Response> => {
  const method = request.method;
  const url = new URL(request.url);

  // POST /api/contact - Public
  if (path === '/api/contact' && method === 'POST') {
    const limited = contactRateLimit(request);
    if (limited) return limited;

    try {
      const body = await request.json() as { name: string; email: string; subject?: string; message: string };
      if (!body.name || !body.email || !body.message) {
        return jsonResponse(errorResponse('Name, email, and message are required'), 400);
      }

      const result = await env.DB.prepare(
        'INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?) RETURNING *'
      ).bind(body.name, body.email, body.subject || null, body.message).first<ContactMessage>();

      return jsonResponse(formatResponse({ message: 'Message sent successfully', id: result?.id }), 201);
    } catch {
      return jsonResponse(errorResponse('Failed to send message'), 500);
    }
  }

  // GET /api/contact - Admin
  if (path === '/api/contact' && method === 'GET') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const { page, limit, offset } = parsePagination(url);
    const isRead = url.searchParams.get('is_read');

    let where = '1=1';
    const params: unknown[] = [];
    if (isRead !== null) { where += ' AND is_read = ?'; params.push(parseInt(isRead, 10)); }

    const [countResult, { results }] = await Promise.all([
      env.DB.prepare(`SELECT COUNT(*) as total FROM contact_messages WHERE ${where}`).bind(...params).first<{ total: number }>(),
      env.DB.prepare(`SELECT * FROM contact_messages WHERE ${where} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
        .bind(...params, limit, offset).all<ContactMessage>(),
    ]);

    return jsonResponse(formatPaginatedResponse(results, countResult?.total || 0, page, limit), 200, privateCacheHeaders);
  }

  // PUT /api/contact/:id/read - Admin
  if (pathParts.length === 4 && pathParts[3] === 'read' && method === 'PUT') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    const result = await env.DB.prepare('UPDATE contact_messages SET is_read = 1 WHERE id = ? RETURNING *')
      .bind(id).first<ContactMessage>();

    if (!result) return jsonResponse(errorResponse('Message not found'), 404);
    return jsonResponse(formatResponse(result), 200);
  }

  // DELETE /api/contact/:id - Admin
  if (pathParts.length === 3 && method === 'DELETE') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const id = parseInt(pathParts[2], 10);
    await env.DB.prepare('DELETE FROM contact_messages WHERE id = ?').bind(id).run();
    return jsonResponse(formatResponse({ message: 'Message deleted' }), 200);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
