'use client';

import { useState, useEffect } from 'react';

interface ImageCarouselProps {
  images: string[];
  title?: string;
  className?: string;
}

export default function ImageCarousel({ images, title = '', className = '' }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // 自动轮播
  useEffect(() => {
    if (!autoPlay || images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 5000); // 每5秒切换一次

    return () => clearInterval(timer);
  }, [autoPlay, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500">暂无图片</span>
      </div>
    );
  }

  const goToPrevious = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setAutoPlay(false);
  };

  const goToNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setAutoPlay(false);
  };

  return (
    <div className={`relative ${className}`} style={{ aspectRatio: '16/9' }}>
      {/* 主图片 */}
      <img
        src={images[currentIndex]}
        alt={`${title} - 图片 ${currentIndex + 1}`}
        className="w-full h-full object-cover"
      />

      {/* 如果只有一张图片，不显示导航 */}
      {images.length > 1 && (
        <>
          {/* 左右导航按钮 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              goToPrevious(e);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
            aria-label="上一张"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              goToNext(e);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors z-10"
            aria-label="下一张"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* 顶部计数器 */}
          <div onClick={(e) => {e.stopPropagation();}}
 className="absolute bottom-3 right-2  bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
            {currentIndex + 1} / {images.length}
          </div>

          {/* 底部小圆圈指示器 */}
          {/* <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(index);
                  setAutoPlay(false);
                }}
                className={`rounded-full z-60 transition-all border-2 ${
                  index === currentIndex
                    ? 'w-3 h-3 bg-white border-white shadow-lg'
                    : 'w-2.5 h-2.5 bg-white/70 border-white/80 hover:bg-white hover:border-white'
                }`}
                aria-label={`跳转到第 ${index + 1} 张图片`}
              />
            ))}
          </div> */}
        </>
      )}
    </div>
  );
}
