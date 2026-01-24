'use client';

import Link from 'next/link';

export function MapPreview() {
  // Flushing 的坐标和房产位置
  const properties = [
    { id: 1, title: 'Studio - Main St', price: 1800, lat: 40.7658, lng: -73.8297, bedrooms: 0 },
    { id: 2, title: '3BR Townhouse', price: 4500, lat: 40.7700, lng: -73.8250, bedrooms: 3 },
    { id: 3, title: '1BR Near Subway', price: 1600, lat: 40.7680, lng: -73.8330, bedrooms: 1 },
    { id: 4, title: 'Family Apt', price: 2800, lat: 40.7640, lng: -73.8270, bedrooms: 2 },
    { id: 5, title: '2BR Condo', price: 2200, lat: 40.7720, lng: -73.8200, bedrooms: 2 },
  ];

  // Flushing 中心坐标
  const center = { lat: 40.7680, lng: -73.8300 };
  const zoom = 13;

  // 计算相对位置
  const getPosition = (lat: number, lng: number) => {
    const latRange = 0.05;
    const lngRange = 0.08;
    const x = ((lng - (center.lng - lngRange / 2)) / lngRange) * 100;
    const y = ((lat - (center.lat - latRange / 2)) / latRange) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  return (
    <Link href="/map" className="block">
      <div className="relative w-full h-64 bg-gradient-to-br from-blue-100 to-blue-50 cursor-pointer hover:opacity-90 transition overflow-hidden">
        {/* 地图网格背景 */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* 房产标记 */}
        {properties.map((prop) => {
          const pos = getPosition(prop.lat, prop.lng);
          return (
            <div
              key={prop.id}
              className="absolute w-8 h-8 bg-red-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-xs font-bold hover:w-10 hover:h-10 transition-all transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              title={`${prop.title} - $${prop.price}/mo`}
            >
              📍
            </div>
          );
        })}

        {/* 信息文字 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/0 hover:bg-black/5 transition">
          <div className="text-center pointer-events-none">
            <p className="text-gray-700 font-semibold">Flushing, Queens, NY</p>
            <p className="text-sm text-gray-500">{properties.length} properties • Click to view on map</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
