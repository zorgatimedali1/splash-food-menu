import { signJWT, verifyPassword, hashPassword } from '../utils/jwt.js';
import { authCacheDelete } from '../utils/cache.js';
import { requireAuth, isAuthError } from '../middleware/auth.js';
import { loginRateLimit, registerRateLimit } from '../middleware/rateLimit.js';
import { jsonResponse, privateCacheHeaders } from '../middleware/security.js';
import { formatResponse, errorResponse } from '../utils/pagination.js';
import type { Env, User } from '../types/index.js';

export const handleAuth = async (request: Request, env: Env, path: string): Promise<Response> => {
  const method = request.method;

  // POST /api/auth/login
  if (path === '/api/auth/login' && method === 'POST') {
    const limited = loginRateLimit(request);
    if (limited) return limited;

    try {
      const { email, password } = await request.json() as { email: string; password: string };
      if (!email || !password) return jsonResponse(errorResponse('Email and password required'), 400);

      const user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email.toLowerCase()).first<User>();
      if (!user) return jsonResponse(errorResponse('Invalid credentials'), 401, privateCacheHeaders);

      const valid = await verifyPassword(password, user.password_hash);
      if (!valid) return jsonResponse(errorResponse('Invalid credentials'), 401, privateCacheHeaders);

      const token = await signJWT(
        { sub: user.id, email: user.email, name: user.name, role: user.role },
        env.JWT_SECRET
      );

      return jsonResponse(
        formatResponse({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }),
        200,
        privateCacheHeaders
      );
    } catch (e: unknown) {
      console.error('Login error:', e);
      return jsonResponse(errorResponse('Invalid request body'), 400);
    }
  }

  // POST /api/auth/register
  if (path === '/api/auth/register' && method === 'POST') {
    const limited = registerRateLimit(request);
    if (limited) return limited;

    try {
      // Only allow if no users exist
      const { count } = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>() || { count: 0 };
      if (count > 0) return jsonResponse(errorResponse('Registration is locked. Admin already exists.'), 403);

      const { email, password, name } = await request.json() as { email: string; password: string; name: string };
      if (!email || !password || !name) return jsonResponse(errorResponse('Email, password, and name required'), 400);
      if (password.length < 8) return jsonResponse(errorResponse('Password must be at least 8 characters'), 400);

      const passwordHash = await hashPassword(password);
      const result = await env.DB.prepare(
        'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?) RETURNING id'
      ).bind(email.toLowerCase(), passwordHash, name, 'admin').first<{ id: number }>();

      if (!result) return jsonResponse(errorResponse('Failed to create user'), 500);

      const token = await signJWT(
        { sub: result.id, email: email.toLowerCase(), name, role: 'admin' },
        env.JWT_SECRET
      );

      return jsonResponse(formatResponse({ token, user: { id: result.id, email, name, role: 'admin' } }), 201);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : '';
      if (msg.includes('UNIQUE')) return jsonResponse(errorResponse('Email already registered'), 409);
      return jsonResponse(errorResponse('Invalid request body'), 400);
    }
  }

  // POST /api/auth/logout
  if (path === '/api/auth/logout' && method === 'POST') {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      authCacheDelete(authHeader.slice(7));
    }
    return jsonResponse(formatResponse({ message: 'Logged out' }), 200, privateCacheHeaders);
  }

  // GET /api/auth/me
  if (path === '/api/auth/me' && method === 'GET') {
    const auth = await requireAuth(request, env);
    if (isAuthError(auth)) return auth;
    return jsonResponse(formatResponse({ id: auth.user.sub, email: auth.user.email, name: auth.user.name, role: auth.user.role }), 200, privateCacheHeaders);
  }

  return jsonResponse(errorResponse('Not found'), 404);
};
