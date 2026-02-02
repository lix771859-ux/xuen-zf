'use client';

import { useEffect } from 'react';
import { mutate } from 'swr';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    alert('注册页面恢复监听器');
    const handler = (event: PageTransitionEvent) => {
      if (event.persisted) {
        alert('页面从缓存中恢复，正在刷新数据...');
        mutate(() => true); // 刷新所有 SWR key
      }
    };

    window.addEventListener("pageshow", handler);
    return () => window.removeEventListener("pageshow", handler);
  }, []);

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