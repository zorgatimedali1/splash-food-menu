export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'",
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

export const publicCacheHeaders = {
  'Cache-Control': 'public, max-age=120, stale-while-revalidate=240',
};

export const privateCacheHeaders = {
  'Cache-Control': 'private, no-cache',
};

export const immutableCacheHeaders = {
  'Cache-Control': 'public, max-age=31536000, immutable',
};

export const jsonHeaders = (extra: Record<string, string> = {}) => ({
  'Content-Type': 'application/json',
  ...securityHeaders,
  ...extra,
});

export const jsonResponse = (
  data: unknown,
  status = 200,
  extraHeaders: Record<string, string> = {}
) =>
  new Response(JSON.stringify(data), {
    status,
    headers: jsonHeaders(extraHeaders),
  });
