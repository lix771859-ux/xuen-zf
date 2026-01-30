"use client"

import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useParams } from "next/navigation"

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

type DetailSheetProps = {
  open: boolean
  onClose: (value: boolean) => void
  data: DetailData
}

export function DetailSheet({ open, onClose, data }: DetailSheetProps) {

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-screen max-w-none h-screen p-0 overflow-y-auto"
      >
        {/* 右上角关闭按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-20"
          onClick={() => onClose(false)}
        >
          <X className="h-6 w-6" />
        </Button>

        {/* 顶部大图 */}
        <div className="w-full h-64 bg-gray-200">
          <img
            src={data.image}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        {/* 内容区域 */}
        <div className="p-6 space-y-3 text-gray-800">
          <h2 className="text-xl font-bold">{data.title}</h2>
          <p>价格：{data.price}</p>
          <p>地址：{data.address}</p>
          <p>面积：{data.area}</p>
          <p>描述：{data.description}</p>
        </div>
      </SheetContent>
    </Sheet>
  )
}