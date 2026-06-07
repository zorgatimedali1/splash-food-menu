export async function compressResponse(response: Response, request: Request): Promise<Response> {
  const accept = request.headers.get('Accept-Encoding') || '';
  if (!accept.includes('gzip')) return response;

  const body = response.body;
  if (!body || response.headers.get('Content-Encoding')) return response;

  const compression = new CompressionStream('gzip');

  const headers = new Headers(response.headers);
  headers.set('Content-Encoding', 'gzip');
  headers.delete('Content-Length');

  return new Response(body.pipeThrough(compression), {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
