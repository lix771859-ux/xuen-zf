import { useHomeStore } from '@/store/useHomeStore';
import Image from 'next/image';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabaseServer';

export default async function PropertyDetail(props: { params: Promise<{ id: string }> }) {
  const resolved = await props.params;
  const id = Number(resolved.id);

  const { data: property, error } = await supabaseServer
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        未找到房源
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-white pb-10">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* 图片展示 */}
        <div className="relative bg-black h-64 overflow-hidden mb-4">
          <img
            src={property.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
            alt={property.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 房产信息 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-600">
              ${property.price?.toLocaleString?.() ?? property.price}
            </span>
            <span className="text-gray-500">/月</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-2">
            <span className="text-gray-700">{property.address}</span>
            <span className="text-gray-700">{property.sqft} 平方尺</span>
            <span className="text-gray-700">
              {property.bedrooms} 室 {property.bathrooms} 卫
            </span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">
              评分：{property.rating ?? 4.5}（{property.reviews ?? 0}条评价）
            </span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">{property.description}</span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">
              配套：{property.amenities?.join?.('、') ?? ''}
            </span>
          </div>

          {property.landlord && (
            <div className="flex items-center gap-3 mt-4">
              <img
                src={property.landlord.avatar}
                alt={property.landlord.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">房东：{property.landlord.name}</div>
                <div className="text-xs text-gray-500">
                  房东评分：{property.landlord.rating}（{property.landlord.reviews}条）
                </div>
                <div className="text-xs text-gray-500">{property.landlord.responseTime}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}