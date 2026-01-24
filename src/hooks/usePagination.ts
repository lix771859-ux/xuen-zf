import { useState, useCallback, useEffect } from 'react';

interface PaginationOptions {
  pageSize?: number;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number | null;
  area?: string;
  search?: string;
}

export interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image: string;
  rating: number;
  reviews: number;
  area: string;
  description?: string;
}

interface PaginationResponse {
  data: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function usePagination(options: PaginationOptions = {}) {
  const [items, setItems] = useState<Property[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = options.pageSize || 10;

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      setIsLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: String(pageNumber),
          pageSize: String(pageSize),
          minPrice: String(options.minPrice || 0),
          maxPrice: String(options.maxPrice || 999999),
          ...(options.bedrooms !== null && options.bedrooms !== undefined && {
            bedrooms: String(options.bedrooms),
          }),
          ...(options.area && { area: options.area }),
          ...(options.search && { search: options.search }),
        });

        const response = await fetch(`/api/properties?${params}`);
        const result: PaginationResponse = await response.json();

        if (pageNumber === 1) {
          setItems(result.data);
        } else {
          setItems((prev) => [...prev, ...result.data]);
        }

        setHasMore(pageNumber < result.totalPages);
        setPage(pageNumber);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, options]
  );

  // 重置并加载第一页
  useEffect(() => {
    fetchPage(1);
  }, [options.minPrice, options.maxPrice, options.bedrooms, options.area, options.search]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPage(page + 1);
    }
  }, [page, isLoading, hasMore, fetchPage]);

  return { items, isLoading, hasMore, error, loadMore, page };
}
