'use client';

import { useEffect } from 'react';
import { mutate } from 'swr';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(
        (registration) => {
          console.log('Service Worker 注册成功：', registration);
        },
        (error) => {
          console.log('Service Worker 注册失败：', error);
        }
      );
    }
  }, []);

  return null;
}