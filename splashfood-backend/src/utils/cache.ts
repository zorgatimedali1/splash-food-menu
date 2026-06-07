interface CacheEntry {
  value: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export const cacheGet = <T>(key: string): T | null => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value as T;
};

export const cacheSet = (key: string, value: unknown, ttlSeconds: number): void => {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
};

export const cacheDelete = (key: string): void => {
  cache.delete(key);
};

export const flushCache = (pattern: string): void => {
  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

export const flushMultiple = (...patterns: string[]): void => {
  patterns.forEach(flushCache);
};

// Auth session cache for JWT validation
const authCache = new Map<string, { user: unknown; expiresAt: number }>();

export const authCacheGet = <T>(token: string): T | null => {
  const entry = authCache.get(token);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    authCache.delete(token);
    return null;
  }
  return entry.user as T;
};

export const authCacheSet = (token: string, user: unknown): void => {
  authCache.set(token, {
    user,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });
};

export const authCacheDelete = (token: string): void => {
  authCache.delete(token);
};
