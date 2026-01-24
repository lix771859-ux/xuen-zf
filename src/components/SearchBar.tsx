'use client';

import { useI18n } from '@/i18n/context';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterClick: () => void;
}

export default function SearchBar({ value, onChange, onFilterClick }: SearchBarProps) {
  const { t } = useI18n();

  return (
    <div style={{ width: '100vw', boxSizing: 'border-box' }} className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div style={{ width: '100%', boxSizing: 'border-box' }} className="px-4 py-4">
        {/* 搜索框 + 新增按钮 */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full px-4 py-2.5 pr-20 bg-gray-100 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            {value && (
              <button
                onClick={() => onChange('')}
                className="absolute right-10 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Clear search"
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <a
            href="/landlord/properties"
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all whitespace-nowrap"
          >
            Add Property
          </a>
        </div>
      </div>
    </div>
  );
}
