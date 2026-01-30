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
import { useRouter } from 'next/navigation';
import { useRefreshStore } from '@/store/useRefreshStore';
import { DetailSheet } from "@/components/ui/deSheet"

export default function Home() {

  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('search');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  type DetailData = {
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
}
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 150000,
    bedrooms: null,
    area: '',
  });
  const id = useRefreshStore((state) => state.id);
  const setid = useRefreshStore((state) => state.setId);
  const setOpenDetail = useRefreshStore((state) => state.setOpenDetail)
  const openDetail = useRefreshStore((state) => state.openDetail)
  const clickCard = (id: number) => {
    setOpenDetail(true);
    setid(id);
  }
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
  const [sheetY, setSheetY] = useState(0); // 初始完全展开，隐藏地图
  const [isDragging, setIsDragging] = useState(false);
  const startYRef = useRef(0);
  const startSheetYRef = useRef(0);
  const [addBtnText, setAddBtnText] = useState(t('newRent'));
  const router = useRouter();
    const [userId, setUserId] = useState<string | null>(null);
    useEffect(() => {
      supabaseBrowser.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
    }, []);
  const handleAddClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (!userId) {
      setAddBtnText(t('pleaseLogin'));
      setTimeout(() => {
        setAddBtnText(t('newRent'));
        router.push('/auth');
      }, 500);
    } else {
      router.push('/landlord/properties');
    }
  };

  const handleLogout = async () => {
    setSigningOut(true);
    try {
      await signOut();
    } finally {
      setSigningOut(false);
    }
  };

  // 处理拖动开始
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startYRef.current = clientY;
    startSheetYRef.current = sheetY;
  };

  // 全局拖动事件
  useEffect(() => {
    if (!isDragging) return;

    const handleDragMove = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientY = e instanceof TouchEvent ? e.touches[0].clientY : e.clientY;
      const diff = clientY - startYRef.current;
      let newY = startSheetYRef.current + diff;

      // 限制范围：-200（向上滚出）到 300（向下隐藏）
      if (newY < -200) newY = -200;
      if (newY > 300) newY = 300;

      setSheetY(newY);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      // 根据位置自动贴靠
      if (sheetY > 150) {
        // 回到初始位置
        setSheetY(300);
      } else if (sheetY < -100) {
        // 完全展开到顶部
        setSheetY(-200);
        setSheetY(0);
      }
    };

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);

    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleDragMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, sheetY]);

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
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 10 }}>
              <MapPreview />
            </div>

            {/* 可上滑的房产列表 */}
            <div
              className="absolute inset-x-0 bottom-0 bg-white  shadow-2xl pointer-events-auto flex flex-col"
              style={{
                height: '100vh',
                top: `${sheetY}px`,
                transition: 'top 0.3s ease-out',
                zIndex: 50,
              }}
            >
              {/* 滚动内容 */}
              <div className="flex-1 overflow-y-auto pb-20 md:pb-40">
                {/* 筛选标签 */}
                <div className="px-4 py-3 flex gap-2 overflow-x-auto justify-between items-center">
                  <div className="flex gap-2 overflow-x-auto">
                      <button onClick={() => {
                        setFilters(prev => ({
                          ...prev,
                          minPrice: 0,
                          maxPrice: 150000,
                          bedrooms: null,
                          area: '',
                        }));
                      }} className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
                        {t('allBtn')}
                      </button>
                      <button
                        onClick={() => setIsFilterOpen(true)}
                        className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50"
                      >
                        {t('filterPrice')}
                      </button>
                  </div>
                  <a
                    href="/landlord/properties"
                    onClick={handleAddClick}
                    className="px-4 py-1.5 border bg-blue-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all whitespace-nowrap"
                  >
                    {addBtnText}
                  </a>
                </div>

                {/* 房产列表 */}
                <div className="w-full px-4 py-2">
                  <p className="text-sm text-gray-600 mb-4">
                    {t('foundProperties', { count: items.length })}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap',justifyContent:'space-between', gap: '0.75rem',width: '100%' }}>
                    {items.length > 0 ? (
                      items.map((property, index) => (
                        <div key={`${property.id}-${index}`} className="flex-auto">
                          <PropertyCard
                            property={property}
                            isFavorite={isFavorite(property.id)}
                            onToggleFavorite={toggleFavorite}
                            onClickCard={() => clickCard(property.id)}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
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
                        onClickCard={() => clickCard(property.id)}
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
      {openDetail && id !== 0 && <DetailSheet open={openDetail} onClose={() => setOpenDetail(false)} id={id} />}

    </div>
  );
}
