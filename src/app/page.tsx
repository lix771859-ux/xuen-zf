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
import ContactLandlord from '@/components/ContactLandlord';
import { useRefreshStore } from '@/store/useRefreshStore';
import { DetailSheet } from "@/components/ui/deSheet"
import { useHomeStore } from '@/store/useHomeStore';

interface MessageType {
  id?: number;
  sender_id: string;
  recipient_id?: string;
  text: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: MessageType[];
}

type MessageInputState = {
  [key: string]: string;
};
export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('search');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQueryPage, setSearchQueryPage] = useState('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageInputs, setMessageInputs] = useState<MessageInputState>({});
  const [sendingMessageId, setSendingMessageId] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState<{ landlordId: string; title: string } | null>(null);
  const [selectedPropertyTitle, setSelectedPropertyTitle] = useState<string | null>(null);
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
  const [filtersPage, setFiltersPage] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 15000,
    bedrooms: null,
    area: '',
  });
  const id = useRefreshStore((state) => state.id);
  const setid = useRefreshStore((state) => state.setId);
  const setOpenDetail = useRefreshStore((state) => state.setOpenDetail)
  const openDetail = useRefreshStore((state) => state.openDetail)
  const scrollY = useHomeStore((state) => state.scrollY);
  const setScrollY = useHomeStore((state) => state.setScrollY);
  const searchQuery = useHomeStore(state => state.searchQuery);
  const filters = useHomeStore(state => state.filters);
  // const fromDetailBack = useHomeStore(state => state.fromDetailBack);
  // const setFromDetailBack = useHomeStore(state => state.setFromDetailBack);
  const { setFromDetailBack } = useHomeStore.getState();
  const setSearchQuery = useHomeStore(state => state.setSearchQuery);
  const setFilters = useHomeStore(state => state.setFilters);
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => {
      console.log('scrollY', container.scrollTop);
      setScrollY(container.scrollTop);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [setScrollY]);

  // 根据 URL 查询参数初始化 tab 和当前会话（用于详情页跳转）
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const peer = params.get('peer');
    const title = params.get('title');

    if (tab === 'messages') {
      setActiveTab('messages');
    }
    if (peer) {
      setSelectedConversationId(peer);
      if (title) {
        setSelectedPropertyTitle(title);
      }
    }
  }, []);

  // 恢复滚动条位置（如需要）
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    console.log('resumesscrollY', container.scrollTop);
    container.scrollTo(0, scrollY)
  }, []); // 只在组件挂载时恢复

  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const clickCard = () => {
    setFromDetailBack(true);
  }
  const handleMessageFromCard = async (landlordId: string, propertyTitle: string) => {
    const { data } = await supabaseBrowser.auth.getUser();
    if (!data.user?.id) {
      const ok = window.confirm('请先登录后再联系房东');
      if (!ok) return;
      router.push('/auth');
      return;
    }

    setContactInfo({ landlordId, title: propertyTitle });
  };

  const loadConversations = async () => {
    const { data } = await supabaseBrowser.auth.getUser();
    if (!data.user?.id) return;

    setCurrentUserId(data.user.id);

    const { data: messages } = await supabaseBrowser
      .from('messages')
      .select('*')
      .or(`recipient_id.eq.${data.user.id},sender_id.eq.${data.user.id}`)
      .order('created_at', { ascending: true });

    const conversationMap: { [key: string]: MessageType[] } = {};
    messages?.forEach((msg: any) => {
      const otherId = msg.sender_id === data.user.id ? msg.recipient_id : msg.sender_id;
      if (!conversationMap[otherId]) {
        conversationMap[otherId] = [];
      }
      conversationMap[otherId].push(msg);
    });

    const convList = Object.entries(conversationMap).map(([userId, msgs]) => ({
      id: userId,
      name: `用户 ${userId.substring(0, 6)}`,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      messages: msgs,
    }));

    setConversations(convList);

    // 根据会话中第一条消息的房源标题，预填当前选中会话的房源信息
    if (selectedConversationId) {
      const current = convList.find((c) => c.id === selectedConversationId);
      const firstMsg: any = current?.messages[0];
      if (firstMsg?.property_title) {
        setSelectedPropertyTitle(firstMsg.property_title);
      }
    }

    // 如果当前没有选中的会话，则默认选中最新一条，方便直接看到最新消息和输入框
    if (!selectedConversationId && convList.length > 0) {
      const latestConv = convList.reduce((latest, conv) => {
        const lastMsg = conv.messages[conv.messages.length - 1];
        if (!lastMsg) return latest;
        if (!latest) return conv;
        const latestLastMsg = latest.messages[latest.messages.length - 1];
        return new Date(lastMsg.created_at) > new Date(latestLastMsg.created_at) ? conv : latest;
      }, convList[0]);

      if (latestConv) {
        setSelectedConversationId(latestConv.id);
      }
    }
  };

  // 订阅当前用户的实时消息，用于 Messages 视图
  useEffect(() => {
    if (!currentUserId) return;

    const channel = supabaseBrowser
      .channel(`messages:list:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(recipient_id.eq.${currentUserId},sender_id.eq.${currentUserId})`,
        },
        (payload: any) => {
          const msg = payload.new as MessageType & { recipient_id: string };
          const otherId = msg.sender_id === currentUserId ? msg.recipient_id! : msg.sender_id;

          setConversations((prev) => {
            const existing = prev.find((c) => c.id === otherId);
            if (existing) {
              return prev.map((c) =>
                c.id === otherId ? { ...c, messages: [...c.messages, msg] } : c
              );
            }

            // 新会话
            return [
              ...prev,
              {
                id: otherId,
                name: `用户 ${otherId.substring(0, 6)}`,
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                messages: [msg],
              },
            ];
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [currentUserId]);

  const handleSendMessage = async () => {
    if (!selectedConversationId || !messageInputs[selectedConversationId]?.trim()) return;

    setSendingMessageId(selectedConversationId);
    try {
      const { data: inserted, error } = await supabaseBrowser
        .from('messages')
        .insert([
          {
            sender_id: currentUserId,
            recipient_id: selectedConversationId,
            text: messageInputs[selectedConversationId],
            property_title: selectedPropertyTitle,
            created_at: new Date().toISOString(),
          },
        ])
        .select('*');

      if (!error) {
        const newMsg = (inserted && inserted[0]) as MessageType & { recipient_id?: string };

        // 本地立即更新当前会话；若不存在则创建新会话
        if (newMsg) {
          setConversations((prev) => {
            const existing = prev.find((c) => c.id === selectedConversationId);
            if (existing) {
              return prev.map((c) =>
                c.id === selectedConversationId
                  ? { ...c, messages: [...c.messages, newMsg] }
                  : c
              );
            }

            return [
              ...prev,
              {
                id: selectedConversationId,
                name: `用户 ${selectedConversationId.substring(0, 6)}`,
                avatar:
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                messages: [newMsg],
              },
            ];
          });
        }

        setMessageInputs((prev) => ({
          ...prev,
          [selectedConversationId]: '',
        }));
      }
    } catch (err) {
      console.error('发送失败:', err);
    } finally {
      setSendingMessageId(null);
    }
  };

  // 当切换到消息标签时加载会话列表
  useEffect(() => {
    if (activeTab === 'messages') {
      loadConversations();
    }
  }, [activeTab]);

  useEffect(() =>{
    setFromDetailBack(false);
  }, [])
  const { items, isLoading, hasMore, loadMore,page } = usePagination({
    pageSize: 6,
    minPrice: filters.minPrice ,
    maxPrice: filters.maxPrice ,
    bedrooms: filters.bedrooms ,
    area: filters.area ,
    search: searchQuery ,
  });

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

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

  // 消息详情：当选中的会话或消息列表变化时，自动滚动到最新一条
  useEffect(() => {
    if (!selectedConversationId) return;
    const timer = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedConversationId, conversations]);

  // 获取收藏的房产
  const favoriteProperties = items.filter((p) => favorites.has(p.id));

  const handleFilterApply = (newFilters: FilterState) => {
    setFiltersPage(newFilters);
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
      const ok = window.confirm('请先登录后再发布房源');
      if (!ok) return;
      setTimeout(() => {
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
              <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-20 md:pb-40">
                {/* 筛选标签 */}
                <div className="px-4 py-3 flex gap-2 overflow-x-auto justify-between items-center">
                  <div className="flex gap-2 overflow-x-auto">
                      <button onClick={() => {
                        setFilters({
                          minPrice: 0,
                          maxPrice: 15000,
                          bedrooms: null,
                          area: '',
                        });
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
                 <div className="flex flex-wrap gap-4">
                    {items.length > 0 ? (
                      items.map((property, index) => (
                        <div key={`${property.id}-${index}`} className="flex-1 ">
                          <PropertyCard
                            property={property}
                            isFavorite={isFavorite(property.id)}
                            onToggleFavorite={toggleFavorite}
                            onClickCard={clickCard}
                            onMessage={handleMessageFromCard}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 w-full">
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
                        onClickCard={clickCard}
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
            {!selectedConversationId ? (
              // 对话列表视图
              conversations.length === 0 ? (
                <div className="px-4 py-8">
                  <div className="bg-white rounded-lg p-6 text-center space-y-4">
                    <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p className="text-gray-500 text-lg">{t('noMessages')}</p>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-4 space-y-2">
                  {conversations.map((conversation) => {
                    const lastMsg = conversation.messages[conversation.messages.length - 1];
                    return (
                      <div
                        key={conversation.id}
                        onClick={() => {
                          setSelectedConversationId(conversation.id);
                          const firstMsg: any = conversation.messages[0];
                          setSelectedPropertyTitle(firstMsg?.property_title ?? null);
                        }}
                        className="bg-white rounded-lg p-4 flex items-start gap-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">
                            {conversation.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {lastMsg?.text || '没有消息'}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(lastMsg?.created_at || '').toLocaleString('zh-CN')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              // 消息详情视图
              (() => {
                const selectedConversation =
                  conversations.find((c) => c.id === selectedConversationId) || {
                    id: selectedConversationId,
                    name: `用户 ${selectedConversationId?.substring(0, 6)}`,
                    avatar:
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                    messages: [] as MessageType[],
                  };
                
                // 获取第一条消息，通常包含房源信息
                const firstMsg = selectedConversation.messages[0];
                
                return (
                  <div className="flex flex-col h-full">
                    {/* 头部 */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center gap-3 z-10">
                      <button 
                        onClick={() => setSelectedConversationId(null)}
                        className="text-blue-600 font-medium"
                      >
                        ← 返回
                      </button>
                      <img
                        src={selectedConversation.avatar}
                        alt={selectedConversation.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedConversation.name}
                        </p>
                      </div>
                    </div>

                    {/* 消息列表 - 房源卡片在里面 */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {/* 房源卡片 - 作为第一条内容 */}
                      {(firstMsg as any)?.property_title && (
                        <div className="mb-4">
                          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                            <p className="text-xs text-gray-500 mb-2">关于房源</p>
                            <div className="flex gap-3">
                              <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                                <img 
                                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop" 
                                  alt="房源" 
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  {(firstMsg as any)?.property_title}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">点击查看详情</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 消息气泡 */}
                      {selectedConversation.messages.map((msg, idx) => {
                        const isOwn = msg.sender_id === currentUserId;
                        return (
                          <div key={idx} className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
                            <div
                              className={`max-w-xs ${
                                isOwn
                                  ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                                  : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none'
                              } px-4 py-2`}
                            >
                              <p className="text-sm">{msg.text}</p>
                              <p className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                                {new Date(msg.created_at).toLocaleTimeString('zh-CN', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* 输入框 */}
                    <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2 bg-white">
                      <input
                        type="text"
                        value={messageInputs[selectedConversationId] || ''}
                        onChange={(e) => setMessageInputs((prev) => ({
                          ...prev,
                          [selectedConversationId]: e.target.value,
                        }))}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleSendMessage();
                        }}
                        placeholder="输入消息..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={sendingMessageId === selectedConversationId || !messageInputs[selectedConversationId]?.trim()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm disabled:opacity-60 whitespace-nowrap"
                      >
                        发送
                      </button>
                    </div>
                  </div>
                );
              })()
            )}
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
                {user && (
                  <a href="/landlord/my-properties" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-900">我的房源</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
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

      {/* 列表快捷联系房东对话框 */}
      {contactInfo && (
        <ContactLandlord
          landlordId={contactInfo.landlordId}
          propertyTitle={contactInfo.title}
          initialExpanded
          onClose={() => setContactInfo(null)}
        />
      )}

      {/* 底部导航栏 */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 筛选弹层 */}
      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
        initialFilters={filtersPage}
      />

    </div>
  );
}
