import { useState, useCallback, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useRefreshStore  } from '@/store/useRefreshStore';
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
  const { shouldRefresh,clearRefresh } = useRefreshStore()
  const reset = () => {
    setItems([])
    setPage(1)
    setHasMore(true)
    loadPage(1)
  }

  const pageSize = options.pageSize || 10;
  const loadPage = async (pageNum: number) => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabaseBrowser
        .from('properties')
        .select('*')
        .range((pageNum - 1) * pageSize, pageNum * pageSize - 1)
        .match({
          ...(options.minPrice && { price: { gte: options.minPrice } }),
          ...(options.maxPrice && { price: { lte: options.maxPrice } }),
          ...(options.bedrooms && { bedrooms: options.bedrooms }),
          ...(options.area && { area: options.area }),
          ...(options.search && { title: options.search }),
        })

      if (error) throw error

      if (pageNum === 1) {
        setItems(data)
      } else {
        setItems((prev) => [...prev, ...data])
      }

      setHasMore(data.length === pageSize)
    } catch (err: any) {
      setError(err.message || '加载失败')
    } finally {
      setIsLoading(false)
    }
  }
  // 重置并加载第一页
  useEffect(() => {
  //   if (shouldRefresh) {
  //   reset()
  //   clearRefresh()
  // }

    const fetchPage = async (pageNumber: number) => {
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

        const url = `/api/properties?${params}`;
        console.log('Fetching properties from:', url);
        const response = await fetch(url);
        const result: PaginationResponse = await response.json();
        console.log('API response:', result);

        if (pageNumber === 1) {
          setItems(result.data);
          console.log('Set items:', result.data);
        } else {
          setItems((prev) => [...prev, ...result.data]);
        }

        setHasMore(pageNumber < result.totalPages);
        setPage(pageNumber);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage(1);
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

  return { items, isLoading, hasMore, error, loadMore, page, reset };
}
