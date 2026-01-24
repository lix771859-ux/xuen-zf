'use client';

import Link from 'next/link';

interface Property {
  id: number;
  title: string;
  price: number;
  lat: number;
  lng: number;
  bedrooms: number;
}

const properties: Property[] = [
  { id: 1, title: '现代公寓', price: 4500, lat: 39.905, lng: 116.401, bedrooms: 2 },
  { id: 2, title: '豪华别墅', price: 8500, lat: 39.915, lng: 116.411, bedrooms: 4 },
  { id: 3, title: '温馨一室', price: 2800, lat: 39.895, lng: 116.391, bedrooms: 1 },
  { id: 4, title: '家庭公寓', price: 5200, lat: 39.925, lng: 116.421, bedrooms: 3 },
];

export default function MapView() {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-lg font-semibold text-gray-900">地图视图</h1>
        </div>
      </div>

      {/* 地图容器 */}
      <div className="flex-1 bg-gradient-to-br from-blue-100 to-blue-50 relative overflow-hidden">
        <div className="w-full h-full flex items-center justify-center">
          {/* 模拟地图 */}
          <div className="relative w-full h-full">
            {/* 背景网格 */}
            <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* 房产标记 */}
            {properties.map((property, index) => {
              const x = 20 + (property.lng - 116.391) * 300;
              const y = 20 + (property.lat - 39.895) * 300;
              return (
                <div
                  key={property.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full"
                  style={{ left: `${x}%`, top: `${y}%` }}
                >
                  {/* 标记点 */}
                  <div className="flex flex-col items-center gap-2 cursor-pointer group">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-400 rounded-full opacity-20 animate-ping"></div>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                        {index + 1}
                      </div>
                    </div>

                    {/* 气泡卡片 */}
                    <div className="bg-white rounded-lg shadow-lg p-2 w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                      <p className="font-semibold text-gray-900 text-sm">{property.title}</p>
                      <p className="text-blue-600 font-bold text-sm">¥{property.price}/月</p>
                      <p className="text-gray-500 text-xs">{property.bedrooms} 卧室</p>
                      <Link
                        href={`/property/${property.id}`}
                        className="mt-2 block text-center bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700"
                      >
                        查看详情
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 图例 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <p className="text-sm font-semibold text-gray-900 mb-2">地图图例</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
              <span>租赁房产</span>
            </div>
            <p className="text-gray-500 mt-2">将鼠标悬停在标记上查看详情</p>
          </div>
        </div>
      </div>
    </div>
  );
}
