'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker 注册成功:', registration);
        },
        (error) => {
          console.log('Service Worker 注册失败:', error);
        }
      );
    }
  }, []);

  return null;
}
