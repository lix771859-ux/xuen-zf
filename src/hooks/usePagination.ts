import { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr'
import {useHomeStore} from '@/store/useHomeStore'

const fetcher = (url: string) => fetch(url).then(res => res.json())
interface PaginationOptions {
  page?: number;
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
  amenities?: string[];
}

interface PaginationResponse {
  data: Property[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function usePagination(options: PaginationOptions = {}) {
  const isLoadingStore = useHomeStore(state => state.isLoadingStore);
  const error = useHomeStore(state => state.error);
  const page = useHomeStore(state => state.page);
  const items = useHomeStore(state => state.items);
  const hasMore = useHomeStore(state => state.hasMore);
  const setItems = useHomeStore(state => state.setItems);
  const setPage = useHomeStore(state => state.setPage);
  const setHasMore = useHomeStore(state => state.setHasMore);
  const setIsLoading = useHomeStore(state => state.setIsLoading);
  const setError = useHomeStore(state => state.setError);

  const pageSize = options.pageSize || 10;
      const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
          minPrice: String(options.minPrice || 0),
          maxPrice: String(options.maxPrice || 999999),
          ...(options.bedrooms !== null && options.bedrooms !== undefined && {
            bedrooms: String(options.bedrooms),
          }),
          ...(options.area && { area: options.area }),
          ...(options.search && { search: options.search }),
        });
        const { data, isLoading } = useSWR<PaginationResponse>(
        `/api/properties?${params}`,
          fetcher
        )
      useEffect(() => {
        if (!data) return;
        if (page === 1) {
          setItems(data.data);
        } else {
          setItems([...useHomeStore.getState().items, ...data.data]);
        }
        setHasMore(page < data.totalPages);
        setIsLoading(isLoading);
        setError(null);
      }, [data, page, setItems, setHasMore, setIsLoading, setError, isLoading]);
  // setPage(pageNumber);
  
  // 重置并加载第一页
  // useEffect(() => {
  //   const fetchPage = async (pageNumber: number) => {
  //     setIsLoading(true);
  //     setError(null);

  //     try {
  //       const params = new URLSearchParams({
  //         page: String(pageNumber),
  //         pageSize: String(pageSize),
  //         minPrice: String(options.minPrice || 0),
  //         maxPrice: String(options.maxPrice || 999999),
  //         ...(options.bedrooms !== null && options.bedrooms !== undefined && {
  //           bedrooms: String(options.bedrooms),
  //         }),
  //         ...(options.area && { area: options.area }),
  //         ...(options.search && { search: options.search }),
  //       });

  //       const url = `/api/properties?${params}`;
  //       console.log('Fetching properties from:', url);
  //       const response = await fetch(url);
  //       const result: PaginationResponse = await response.json();
  //       console.log('API response:', result);

  //       if (pageNumber === 1) {
  //         setItems(result.data);
  //         console.log('Set items:', result.data);
  //       } else {
  //         setItems((prev) => [...prev, ...result.data]);
  //       }

  //       setHasMore(pageNumber < result.totalPages);
  //       setPage(pageNumber);
  //     } catch (err) {
  //       console.error('Fetch error:', err);
  //       setError(err instanceof Error ? err.message : 'Failed to fetch');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchPage(1);
  // }, [pageSize, options.minPrice, options.maxPrice, options.bedrooms, options.area, options.search]);

  // const fetchPageForMore = useCallback(
  //   async (pageNumber: number) => {
  //     // setIsLoading(true);
  //     setError(null);

  //     try {
  //       const params = new URLSearchParams({
  //         page: String(pageNumber),
  //         pageSize: String(pageSize),
  //         minPrice: String(options.minPrice || 0),
  //         maxPrice: String(options.maxPrice || 999999),
  //         ...(options.bedrooms !== null && options.bedrooms !== undefined && {
  //           bedrooms: String(options.bedrooms),
  //         }),
  //         ...(options.area && { area: options.area }),
  //         ...(options.search && { search: options.search }),
  //       });

  //       const response = await fetch(`/api/properties?${params}`);
  //       const result: PaginationResponse = await response.json();

  //       setItems((prev) => [...prev, ...result.data]);
  //       setHasMore(pageNumber < result.totalPages);
  //       setPage(pageNumber);
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : 'Failed to fetch');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   },
  //   [pageSize, options.minPrice, options.maxPrice, options.bedrooms, options.area, options.search]
  // );

  // const loadMore = useCallback(() => { //保存函数引用 防止不必要的重渲染 子组件判断props变化来确定是否重渲染
  //   if (!isLoading && hasMore) {
  //     fetchPageForMore(page + 1);
  //   }
  // }, [page, isLoading, hasMore, fetchPageForMore]);
  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(page + 1);
    }
  }

  return { items:items ?? [], isLoading, hasMore, error, loadMore, page };
}
