import { create } from 'zustand';

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  area: string;
}

interface HomeState {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  items: any[];
  setItems: (items: any[]) => void;
  page: number;
  setPage: (page: number) => void;
  hasMore: boolean;
  setHasMore: (v: boolean) => void;
  isFilterOpen: boolean;
  setIsFilterOpen: (v: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  scrollY: number;
  setScrollY: (y: number) => void;
  lastDepsStr?: string;
  setLastDepsStr?: (s: string) => void;
  fromDetailBack: boolean;
  setFromDetailBack: (v: boolean) => void;
  reset: () => void;
  isLoadingStore: boolean;
  setIsLoading: (isLoadingStore: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const initialFilters: FilterState = {
  minPrice: 0,
  maxPrice: 150000,
  bedrooms: null,
  area: '',
};

export const useHomeStore = create<HomeState>((set) => ({
  isLoadingStore: false,
  setIsLoading: (isLoadingStore: boolean) => set({ isLoadingStore }),
  error: null,
  setError: (error: string | null) => set({ error }),
  filters: initialFilters,
  setFilters: (filters) => set({ filters }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  items: [],
  setItems: (items) => set({ items }),
  page: 1,
  setPage: (page) => set({ page }),
  hasMore: true,
  setHasMore: (hasMore) => set({ hasMore }),
  isFilterOpen: false,
  setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
  activeTab: 'search',
  setActiveTab: (activeTab) => set({ activeTab }),
  scrollY: 0,
  setScrollY: (scrollY) => set({ scrollY }),
  lastDepsStr: undefined,
  setLastDepsStr: (s) => set({ lastDepsStr: s }),
  fromDetailBack: false,
  setFromDetailBack: (v) => set({ fromDetailBack: v }),
  reset: () => set({
    filters: initialFilters,
    searchQuery: '',
    items: [],
    page: 1,
    hasMore: true,
    isFilterOpen: false,
    activeTab: 'search',
    scrollY: 0,
  }),
}));
