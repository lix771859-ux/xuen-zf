'use client';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import ImageCarousel from './ImageCarousel';

interface Property {
  id: number;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  image?: string | null;
  images?: string[];
  rating: number;
  reviews: number;
  video?: string | null;
}

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  onClickCard: () => void;
}

export default function PropertyCard({ property, isFavorite, onToggleFavorite, onClickCard }: PropertyCardProps) {
  const { t } = useI18n();
  const router = useRouter();
  const handleCardClick = () => {
    onClickCard();
    router.push(`/property/${property.id}`, { scroll: false });
  }
  return (
    <div onClick={handleCardClick} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative">
        {property.images && property.images.length > 0 ? (
          <ImageCarousel 
            images={property.images} 
            title={property.title}
            className="w-full h-48 object-cover"
          />
        ) : property.video ? (
          <video
            src={property.video || undefined}
            controls
            className="w-full h-48 object-cover"
          />
        ) : (
          <img
            src={property.image || undefined}
            alt={property.title}
            className="w-full h-48 object-cover"
          />
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-gray-50"
        >
          <svg
            className={`w-5 h-5 ${isFavorite ? 'text-red-500 fill-current' : 'text-gray-600'}`}
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-3">
        {/* 标题 */}
        <h3 className="font-semibold text-gray-900 truncate text-sm">{property.title}</h3>

        {/* 价格 */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
          <span className="text-xs text-gray-500">{t('perMonth')}</span>
        </div>

        {/* 地址 */}
        <p className="text-xs text-gray-500 mt-1 truncate flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {property.address}
        </p>

        {/* 房间信息 */}
        <div className="flex gap-4 mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 5h4" />
            </svg>
            {property.bedrooms} {t('bedroomsCount')}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6V4m12 2v2m7 0a2 2 0 01-2 2H3a2 2 0 01-2-2V4a2 2 0 012-2h14a2 2 0 012 2v16a2 2 0 01-2 2H3a2 2 0 01-2-2V4z" />
            </svg>
            {property.bathrooms} {t('bathrooms')}
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            {property.sqft} {t('sqft')}
          </div>
        </div>

        {/* 评分 */}
        <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-0.5">
            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
          </div>
          <span className="text-xs text-gray-500">({property.reviews} {t('reviews')})</span>
        </div>
      </div>
    </div>
  );
}
