'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const [activeTab, setActiveTab] = useState('search');

  // 模拟房产数据
  const properties = [
    {
      id: 1,
      title: '现代公寓 - 市中心',
      price: 4500,
      address: '中山路123号',
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop',
      rating: 4.8,
      reviews: 24,
    },
    {
      id: 2,
      title: '豪华别墅 - 安静社区',
      price: 8500,
      address: '绿岛路456号',
      bedrooms: 4,
      bathrooms: 3,
      sqft: 3500,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=500&fit=crop',
      rating: 4.9,
      reviews: 42,
    },
    {
      id: 3,
      title: '温馨一室 - 靠近地铁',
      price: 2800,
      address: '翠景路789号',
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=500&fit=crop',
      rating: 4.6,
      reviews: 18,
    },
    {
      id: 4,
      title: '家庭公寓 - 靠近学校',
      price: 5200,
      address: '学府街321号',
      bedrooms: 3,
      bathrooms: 2,
      sqft: 1800,
      image: 'https://images.unsplash.com/photo-1545545741-2ea3ebf61fa3?w=500&h=500&fit=crop',
      rating: 4.7,
      reviews: 31,
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航栏 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-blue-600">租房App</h1>
        </div>
      </div>

      {/* 主容器 */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto">
          {activeTab === 'search' && (
            <div>
              {/* 搜索栏 */}
              <SearchBar />

              {/* 筛选标签 */}
              <div className="px-4 py-3 flex gap-2 overflow-x-auto">
                <button className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-sm font-medium whitespace-nowrap">
                  全部
                </button>
                <button className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50">
                  价格
                </button>
                <button className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50">
                  卧室
                </button>
                <button className="px-4 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-full text-sm font-medium whitespace-nowrap hover:bg-gray-50">
                  地区
                </button>
              </div>

              {/* 房产列表 */}
              <div className="px-4 py-2">
                <p className="text-sm text-gray-600 mb-4">找到 {properties.length} 个房产</p>
                <div className="space-y-3">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 text-lg">暂无收藏房产</p>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="px-4 py-8 text-center">
              <p className="text-gray-500 text-lg">暂无消息</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="px-4 py-8">
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                  U
                </div>
                <p className="text-lg font-medium">用户账户</p>
                <p className="text-gray-500 text-sm mt-1">点击登录或注册</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部导航栏 */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
