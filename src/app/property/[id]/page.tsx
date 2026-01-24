'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  // 模拟房产详情数据
  const property = {
    id: parseInt(params.id),
    title: '现代公寓 - 市中心',
    price: 4500,
    address: '中山路123号',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1565183928294-7563f3ce68c5?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 24,
    description: '这是一个宽敞明亮的现代公寓，位于城市中心的黄金地段。完全翻新，配备最新的家电和设施。',
    amenities: [
      '空调',
      '暖气',
      '洗衣机',
      '洗碗机',
      '微波炉',
      '冰箱',
      '电视',
      '无线网络',
      '停车位',
      '电梯',
      '24小时保安',
      '健身房',
    ],
    landlord: {
      name: '张先生',
      rating: 4.9,
      reviews: 156,
      responseTime: '通常一小时内回复',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </Link>
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className={`w-6 h-6 ${liked ? 'text-red-500' : 'text-gray-600'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* 图片轮播 */}
        <div className="relative bg-black h-64 overflow-hidden">
          <img
            src={property.images[selectedImage]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {/* 图片指示器 */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          {/* 小图预览 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-colors ${
                  selectedImage === index ? 'border-white' : 'border-white/30 hover:border-white/50'
                }`}
              >
                <img src={image} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 房产信息 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">¥{property.price.toLocaleString()}</span>
            <span className="text-gray-500">/月</span>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
              <p className="text-xs text-gray-500 mt-1">卧室</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
              <p className="text-xs text-gray-500 mt-1">卫浴</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.sqft}</p>
              <p className="text-xs text-gray-500 mt-1">平方米</p>
            </div>
          </div>

          {/* 位置 */}
          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-100">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">{property.address}</p>
              <p className="text-sm text-gray-500 mt-1">点击查看地图</p>
            </div>
          </div>

          {/* 评分 */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-gray-900">{property.rating}</span>
            </div>
            <span className="text-sm text-gray-500">基于 {property.reviews} 条评价</span>
          </div>
        </div>

        {/* 描述 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">关于此房产</h2>
          <p className="text-gray-600 text-sm leading-6">{property.description}</p>
        </div>

        {/* 设施 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">设施与服务</h2>
          <div className="grid grid-cols-2 gap-3">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 房东信息 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">房东信息</h2>
          <div className="flex items-start gap-3">
            <img
              src={property.landlord.avatar}
              alt={property.landlord.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{property.landlord.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">{property.landlord.rating}</span>
                <span className="text-sm text-gray-500">({property.landlord.reviews} 评价)</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{property.landlord.responseTime}</p>
            </div>
          </div>
        </div>

        {/* 评价 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">租客评价</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">非常好</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">这个公寓很干净，房东很友好。位置也很方便。</p>
                <p className="text-xs text-gray-500 mt-2">李女士 · 2 个月前</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部固定按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <button className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            发送消息
          </button>
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            立即租赁
          </button>
        </div>
      </div>
    </div>
  );
}
