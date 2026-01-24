import { useState, useEffect } from 'react';

export interface FavoriteProperty {
  id: number;
  title: string;
  price: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // 从本地存储加载收藏
  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      try {
        const ids = JSON.parse(stored);
        setFavorites(new Set(ids));
      } catch (e) {
        console.error('Failed to load favorites:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // 添加或移除收藏
  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => {
      const updated = new Set(prev);
      if (updated.has(propertyId)) {
        updated.delete(propertyId);
      } else {
        updated.add(propertyId);
      }
      // 保存到本地存储
      localStorage.setItem('favorites', JSON.stringify(Array.from(updated)));
      return updated;
    });
  };

  const isFavorite = (propertyId: number) => favorites.has(propertyId);

  return { favorites, toggleFavorite, isFavorite, isLoaded };
}
