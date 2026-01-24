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
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

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

  // Auth state
  const { user, loading: authLoading, signOut } = useSupabaseUser();
  const [signingOut, setSigningOut] = useState(false);
  const [sheetY, setSheetY] = useState(0); // 0表示展开，正值表示下拉
  const sheetRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const startSheetYRef = useRef(0);

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  // 处理拖动开始
  const handleTouchStart = (e: React.TouchEvent) => {
    startYRef.current = e.touches[0].clientY;
    startSheetYRef.current = sheetY;
  };

  // 处理拖动中
  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - startYRef.current;
    let newY = startSheetYRef.current + diff;

    // 限制范围：0（完全展开）到 最大高度（回到初始位置）
    if (newY < 0) newY = 0;
    if (newY > 500) newY = 500; // 最多下拉500px

    setSheetY(newY);
  };

  // 处理拖动结束
  const handleTouchEnd = () => {
    // 根据速度或位置决定是否贴靠
    if (sheetY > 100) {
      // 下拉超过100px，回弹到初始位置
      setSheetY(500);
    } else {
      // 否则完全展开
      setSheetY(0);
    }
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

      {/* 主容器 - 地图 + 可上滑列表 */}
      <div className="flex-1 relative overflow-hidden w-full">
        {activeTab === 'search' && (
          <>
            {/* 背景地图 */}
            <div className="absolute inset-0 z-0">
              <MapPreview />
            </div>

            {/* 可上滑的房产列表 */}
            <div
              ref={sheetRef}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="absolute inset-x-0 bottom-0 bg-white rounded-t-3xl shadow-2xl overflow-hidden z-10 transition-transform duration-300"
              style={{
                height: '70vh',
                top: `calc(30vh + ${sheetY}px)`,
              }}
            >
              {/* 拖动指示器 */}
              <div className="sticky top-0 bg-white pt-2 pb-1 flex justify-center cursor-grab active:cursor-grabbing">
                <div className="w-12 h-1 bg-gray-300 rounded-full\"></div>
              </div>

              {/* 滚动内容 */}
              <div className="overflow-y-auto h-full pb-20">
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
            </div>
          </>
        )}

        {activeTab === 'saved' && (
          <div className="overflow-y-auto h-full pb-20">
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
          <div className="overflow-y-auto h-full pb-20">
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
          <div className="overflow-y-auto h-full pb-20">
            <div className="px-4 py-8 space-y-4">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  {(user?.email?.[0] || 'U').toUpperCase()}
                </div>
                {user ? (
                  <>
                    <p className="text-lg font-medium">{user.email}</p>
                    <p className="text-gray-500 text-sm mt-1">已登录</p>
                    <div className="mt-4 flex items-center justify-center gap-3">
                      <a href="/landlord/properties" className="px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                        管理房源
                      </a>
                      <button onClick={handleLogout} disabled={signingOut} className="px-4 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
                        {signingOut ? '退出中…' : t('logout')}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-lg font-medium">{t('userAccount')}</p>
                    <p className="text-gray-500 text-sm mt-1">{t('clickToLogin')}</p>
                    <a href="/auth" className="inline-block mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      {t('loginRegister')}
                    </a>
                  </>
                )}
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
