'use client';

import React from 'react';
import { useI18n } from '@/i18n/context';
import { useHomeStore } from '@/store/useHomeStore';
import { useState, useRef, useEffect } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
  initialFilters: FilterState;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  area: string;
}

export default function FilterModal({ isOpen, onClose, onApply, initialFilters }: FilterModalProps) {
  // const [setFilters] = React.useState<FilterState>(initialFilters);
  const { t } = useI18n();
  const searchQuery = useHomeStore(state => state.searchQuery);
  const filters = useHomeStore(state => state.filters);
  const fromDetailBack = useHomeStore(state => state.fromDetailBack);
  const setFromDetailBack = useHomeStore(state => state.setFromDetailBack);
  const setSearchQuery = useHomeStore(state => state.setSearchQuery);
  const setFilters = useHomeStore(state => state.setFilters);

  if (!isOpen) return null;

  const handleApply = () => {
    setFilters(filters);
    onApply(filters);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 animate-in fade-in">
      <div className="fixed bottom-0 left-0 right-0 my-14 bg-white rounded-t-2xl shadow-2xl max-w-md mx-auto animate-in slide-in-from-bottom">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{t('filterTitle')}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Filter content */}
        <div className="px-4 py-4 space-y-6 max-h-96 overflow-y-auto">
          {/* Price range */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t('priceRange')}</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">{t('minPrice')} ${filters.minPrice}</label>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={filters.minPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, minPrice: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">{t('maxPrice')} ${filters.maxPrice}</label>
                <input
                  type="range"
                  min="1000"
                  max="15000"
                  step="500"
                  value={filters.maxPrice}
                  onChange={(e) =>
                    setFilters({ ...filters, maxPrice: parseInt(e.target.value) })
                  }
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t('bedroomsCount')}</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, '5+'].map((num) => (
                <button
                  key={num}
                  onClick={() =>
                    setFilters({
                      ...filters,
                      bedrooms: filters.bedrooms === num ? null : num as number,
                    })
                  }
                  className={`flex-1 py-2 rounded-lg border-2 font-medium transition-colors ${
                    filters.bedrooms === num
                      ? 'border-blue-600 bg-blue-50 text-blue-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">{t('areaSelect')}</h3>
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All</option>
              <option value="downtown">Downtown</option>
              <option value="east">East</option>
              <option value="west">West</option>
              <option value="north">North</option>
              <option value="south">South</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 py-4 border-t border-gray-200">
          <button
            onClick={() => {
              setFilters({minPrice: 0,
                maxPrice: 15000,
                bedrooms: null,
                area: '',});
              onApply({
                minPrice: 0,
                maxPrice: 15000,
                bedrooms: null,
                area: '',
              });
              // onClose();
            }}
            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            {t('reset')}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            {t('apply')}
          </button>
        </div>
      </div>
    </div>
  );
}

