import { requireAuth, isAuthError } from '../middleware/auth.js';
import { publicApiRateLimit, adminRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, publicCacheHeaders, privateCacheHeaders } from '../middleware/security.js';
import { formatResponse, errorResponse } from '../utils/pagination.js';
import { cacheGet, cacheSet, flushCache } from '../utils/cache.js';
import type { Env, SiteSetting } from '../types/index.js';

export const handleSettings = async (request: Request, env: Env, path: string): Promise<Response> => {
  const method = request.method;

  // GET /api/settings - Public
  if (path === '/api/settings' && method === 'GET') {
    const limited = publicApiRateLimit(request);
    if (limited) return limited;

    const cacheKey = 'settings:all';
    const cached = cacheGet(cacheKey);
    if (cached) return jsonResponse(formatResponse(cached), 200, publicCacheHeaders);

    const { results } = await env.DB.prepare('SELECT * FROM site_settings').all<SiteSetting>();
    const settings: Record<string, string | null> = {};
    results.forEach(s => { settings[s.key] = s.value; });

    cacheSet(cacheKey, settings, 600);
    return jsonResponse(formatResponse(settings), 200, publicCacheHeaders);
  }

  // PUT /api/settings - Admin
  if (path === '/api/settings' && method === 'PUT') {
    const limited = adminRateLimit(request);
    if (limited) return limited;
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;

    const body = await request.json() as Record<string, string>;
    const updates = Object.entries(body).map(([key, value]) =>
      env.DB.prepare(
        'INSERT INTO site_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP) ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at'
      ).bind(key, value).run()
    );

    await Promise.all(updates);
    flushCache('settings');
    return jsonResponse(formatResponse({ message: 'Settings updated', keys: Object.keys(body) }), 200, privateCacheHeaders);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
