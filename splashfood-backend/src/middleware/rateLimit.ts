interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const limiters = new Map<string, RateLimitEntry>();

// Periodically prune expired entries so the Map doesn't grow unbounded
// (Workers are long-lived within an isolate between requests)
let lastPruned = 0;
const pruneExpired = () => {
  const now = Date.now();
  if (now - lastPruned < 60_000) return; // at most once per minute
  lastPruned = now;
  for (const [key, entry] of limiters) {
    if (now > entry.resetAt) limiters.delete(key);
  }
};

const getClientIP = (request: Request): string => {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('X-Forwarded-For')?.split(',')[0].trim() ||
    'unknown'
  );
};

export const rateLimit = (
  request: Request,
  keyPrefix: string,
  maxRequests: number,
  windowSeconds: number
): Response | null => {
  const ip = getClientIP(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  pruneExpired();

  const entry = limiters.get(key);

  if (!entry || now > entry.resetAt) {
    limiters.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return null;
  }

  if (entry.count >= maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new Response(
      JSON.stringify({ error: true, message: 'Too many requests, please try again later' }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(maxRequests),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(Math.ceil(entry.resetAt / 1000)),
        },
      }
    );
  }

  entry.count++;
  return null;
};

// Preset rate limiters
export const loginRateLimit = (req: Request) => rateLimit(req, 'login', 5, 15 * 60);
export const registerRateLimit = (req: Request) => rateLimit(req, 'register', 3, 60 * 60);
export const publicApiRateLimit = (req: Request) => rateLimit(req, 'public', 100, 60);
export const orderRateLimit = (req: Request) => rateLimit(req, 'order', 10, 60);
export const contactRateLimit = (req: Request) => rateLimit(req, 'contact', 5, 60);
export const adminRateLimit = (req: Request) => rateLimit(req, 'admin', 200, 60);
