'use client';

import { useI18n } from '@/i18n/context';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { t } = useI18n();

  const navItems = [
    {
      id: 'search',
      label: t('search'),
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-600'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: 'saved',
      label: t('saved'),
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-600'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      id: 'messages',
      label: t('messages'),
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-600'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: (active: boolean) => (
        <svg className={`w-6 h-6 ${active ? 'text-blue-600' : 'text-gray-600'}`} fill={active ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-[100]">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-1 py-1 px-3 flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === item.id
                ? 'text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {item.icon(activeTab === item.id)}
            <span className={`text-xs font-medium ${activeTab === item.id ? 'text-blue-600' : 'text-gray-600'}`}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}
