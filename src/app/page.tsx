'use client';

import { useState, useRef, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import BottomNav from '@/components/BottomNav';
import FilterModal, { FilterState } from '@/components/FilterModal';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MapPreview } from '@/components/MapPreview';
import { useFavorites } from '@/hooks/useFavorites';
import { usePagination } from '@/hooks/usePagination';
import { useI18n } from '@/i18n/context';

export default function Home() {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('search');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 1000,
    maxPrice: 15000,
    bedrooms: null,
    area: '',
  });

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { items, isLoading, hasMore, loadMore } = usePagination({
    pageSize: 6,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    bedrooms: filters.bedrooms,
    area: filters.area || undefined,
    search: searchQuery,
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 无限滚动逻辑
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, loadMore]);

  // 获取收藏的房产
  const favoriteProperties = items.filter((p) => favorites.has(p.id));

  const handleFilterApply = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50 overflow-x-hidden">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm w-full">
        <div className="px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-600">{t('appName')}</h1>
          <LanguageSwitcher />
        </div>
      </div>

      {/* 搜索栏（完全独立，不在 overflow 容器内） */}
      {activeTab === 'search' && (
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onFilterClick={() => setIsFilterOpen(true)}
        />
      )}

      {/* 主容器 */}
      <div
        className="flex-1 overflow-y-auto pb-20 w-full"
        ref={scrollContainerRef}
      >
        {activeTab === 'search' && (
          <>
            <div>
              {/* 地图预览 */}
              <div className="px-4 py-4">
                <MapPreview />
              </div>

              {/* 筛选标签 */}
              <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
                  {t('allBtn')}
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50"
                >
                  {t('filterPrice')}
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50"
                >
                  {t('filterBedrooms')}
                </button>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50"
                >
                  {t('filterArea')}
                </button>
              </div>

              {/* 房产列表 */}
              <div className="w-full px-4 py-2">
                <p className="text-sm text-gray-600 mb-4">
                  {t('foundProperties', { count: items.length })}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                  {items.length > 0 ? (
                    items.map((property) => (
                      <div key={property.id}>
                        <PropertyCard
                          property={property}
                          isFavorite={isFavorite(property.id)}
                          onToggleFavorite={toggleFavorite}
                        />
                      </div>
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1' }} className="text-center py-8">
                      <p className="text-gray-500">{t('noProperties')}</p>
                    </div>
                  )}
                </div>

                {/* 加载更多指示器 */}
                <div ref={loadMoreRef} className="py-8 text-center">
                  {isLoading && (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200"></div>
                    </div>
                  )}
                  {!hasMore && items.length > 0 && (
                    <p className="text-gray-500 text-sm">{t('noMoreProperties')}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div>
            <div className="px-4 py-4">
              {favoriteProperties.length > 0 ? (
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                    {t('savedCount', { count: favoriteProperties.length })}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {favoriteProperties.map((property) => (
                      <PropertyCard
                        key={property.id}
                        property={property}
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">{t('noSaved')}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <div className="px-4 py-8">
              <div className="bg-white rounded-lg p-6 text-center space-y-4">
                <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500 text-lg">{t('noMessages')}</p>
                <a href="/messages" className="inline-block text-blue-600 hover:text-blue-700 text-sm font-medium">
                  {t('viewMessages')}
                </a>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div>
            <div className="px-4 py-8 space-y-4">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  U
                </div>
                <p className="text-lg font-medium">{t('userAccount')}</p>
                <p className="text-gray-500 text-sm mt-1">{t('clickToLogin')}</p>
                <a href="/auth" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  {t('loginRegister')}
                </a>
              </div>

              <div className="bg-white rounded-lg p-4 space-y-3">
                <a href="/map" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{t('mapView')}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <button className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{t('settings')}</span>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button className="w-full text-left flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg text-red-600">
                  <span className="font-medium">{t('logout')}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 底部导航栏 */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 筛选弹层 */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filters}
      />
    </div>
  );
}
