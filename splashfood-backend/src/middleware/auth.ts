import { verifyJWT } from '../utils/jwt.js';
import { authCacheGet, authCacheSet } from '../utils/cache.js';
import type { JWTPayload, Env } from '../types/index.js';

export const requireAuth = async (
  request: Request,
  env: Env
): Promise<{ user: JWTPayload } | Response> => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: true, message: 'Authorization required' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.slice(7);

  // Check auth cache first
  const cached = authCacheGet<JWTPayload>(token);
  if (cached) return { user: cached };

  const payload = await verifyJWT(token, env.JWT_SECRET);
  if (!payload) {
    return new Response(JSON.stringify({ error: true, message: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Cache the decoded payload
  authCacheSet(token, payload);

  return { user: payload };
};

export const isAuthError = (result: { user: JWTPayload } | Response): result is Response => {
  return result instanceof Response;
};
