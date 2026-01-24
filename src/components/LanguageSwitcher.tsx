'use client';

import { useI18n } from '@/i18n/context';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'en'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-3 py-1 rounded text-sm font-medium transition ${
          language === 'zh'
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        中文
      </button>
    </div>
  );
}
