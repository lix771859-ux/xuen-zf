"use client"

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useParams } from "next/navigation"
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

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
  description: string;
  amenities: string[];
  landlord: {
    avatar: string;
    name: string;
    rating: number;
    reviews: number;
    responseTime: string;
  };
  images: string[];
}

type DetailSheetProps = {
  open: boolean
  onClose: (value: boolean) => void
  id: number
}

export function DetailSheet({ open, onClose, id }: DetailSheetProps) {
  const { data, isLoading } = useSWR<DetailData>(
    open ? `/api/property/${id}` : null,
    fetcher
  )

  if (!open) return null
  if (isLoading || !data) return <div>加载中...</div>

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen max-w-none h-screen p-0 overflow-y-auto"
      >
        <div className="min-h-screen bg-white pb-10">
          <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <div onClick={() => onClose(false)} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </div>
        </div>
      </div>
        <div className="max-w-md mx-auto">
        {/* 图片展示 */}
        <div className="relative bg-black h-64 overflow-hidden mb-4">
          <img
            src={data.images?.[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop'}
            alt={data.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* 房产信息 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{data.title}</h1>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-600">
              ${data.price?.toLocaleString?.() ?? data.price}
            </span>
            <span className="text-gray-500">/月</span>
          </div>

          <div className="flex flex-wrap gap-4 mb-2">
            <span className="text-gray-700">{data.address}</span>
            <span className="text-gray-700">{data.sqft} 平方尺</span>
            <span className="text-gray-700">
              {data.bedrooms} 室 {data.bathrooms} 卫
            </span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">
              评分：{data.rating ?? 4.5}（{data.reviews ?? 0}条评价）
            </span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">{data.description}</span>
          </div>

          <div className="mb-2">
            <span className="text-gray-700">
              配套：{data.amenities?.join?.('、') ?? ''}
            </span>
          </div>

          {data.landlord && (
            <div className="flex items-center gap-3 mt-4">
              <img
                src={data.landlord.avatar}
                alt={data.landlord.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium text-gray-900">房东：{data.landlord.name}</div>
                <div className="text-xs text-gray-500">
                  房东评分：{data.landlord.rating}（{data.landlord.reviews}条）
                </div>
                <div className="text-xs text-gray-500">{data.landlord.responseTime}</div>
              </div>
            </div>
          )}
        </div>
      </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}