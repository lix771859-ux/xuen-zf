import { useState, useCallback, useEffect, useRef } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
// import { useRefreshStore  } from '@/store/useRefreshStore';
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

  // 依赖变化时加载第一页
  useEffect(() => {
    let ignore = false;
    const fetchPage = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: '1',
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
        if (!ignore) {
          setItems(result.data);
          setHasMore(result.data.length === pageSize && result.data.length > 0);
          setPage(1);
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };
    fetchPage();
    return () => {
      ignore = true;
    };
  }, [pageSize, options.minPrice, options.maxPrice, options.bedrooms, options.area, options.search]);

  const fetchPageForMore = useCallback(
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
        setItems((prev) => [...prev, ...result.data]);
        setHasMore(pageNumber < result.totalPages);
        setPage(pageNumber);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setIsLoading(false);
      }
    },
    [pageSize, options.minPrice, options.maxPrice, options.bedrooms, options.area, options.search]
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchPageForMore(page + 1);
    }
  }, [page, isLoading, hasMore, fetchPageForMore]);

  // 重置分页到第一页
  const reset = () => {
    setPage(1);
  };

  return { items, isLoading, hasMore, error, loadMore, page, reset };
}
