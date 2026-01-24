'use client';

import { useI18n } from '@/i18n/context';

export function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();

  return (
    <div className="relative inline-flex bg-gray-100 rounded-lg p-1 shadow-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`relative px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 z-10 ${
          language === 'en'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {language === 'en' && (
          <div className="absolute inset-0 bg-white rounded-md shadow-sm -z-10" />
        )}
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`relative px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-200 z-10 ${
          language === 'zh'
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {language === 'zh' && (
          <div className="absolute inset-0 bg-white rounded-md shadow-sm -z-10" />
        )}
        中文
      </button>
    </div>
  );
}
