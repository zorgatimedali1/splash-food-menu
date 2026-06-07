export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export const parsePagination = (url: URL): PaginationParams => {
  const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
};

export const formatPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => ({
  error: false as const,
  data,
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
});

export const formatResponse = <T>(data: T) => ({
  error: false as const,
  data,
});

export const errorResponse = (message: string) => ({
  error: true as const,
  message,
});
