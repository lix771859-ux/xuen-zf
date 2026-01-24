
'use client';

import { useState } from 'react';
import { useI18n } from '@/i18n/context';
import Link from 'next/link';
import Image from 'next/image';

const propertyData = [
  {
    id: 1,
    title: 'Modern Studio - Near Main St',
    price: 1800,
    address: '133-25 Roosevelt Ave, Flushing, NY',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691723518-36a5ac3be353?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 24,
    description: 'Bright studio steps from Main St and the 7 train. Newly renovated with modern finishes and lots of natural light.',
    amenities: ['In-unit washer/dryer', 'Elevator building', 'Doorman', 'Near 7 train', 'Central AC', 'High-speed Wi‑Fi'],
    landlord: {
      name: 'Mr. Chen',
      rating: 4.9,
      reviews: 156,
      responseTime: 'Usually replies within 1 hour',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    },
  },
  {
    id: 2,
    title: 'Luxury 3BR Townhouse',
    price: 4500,
    address: '41-20 Murray St, Flushing, NY',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2000,
    images: [
      'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 42,
    description: 'Spacious townhouse with private backyard, great for families. Quick access to Murray Hill LIRR and Northern Blvd.',
    amenities: ['Private backyard', 'Dishwasher', 'Washer/Dryer', 'Parking option', 'Central AC', 'Finished basement'],
    landlord: {
      name: 'Ms. Lin',
      rating: 4.9,
      reviews: 98,
      responseTime: 'Replies within 2 hours',
      avatar: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop',
    },
  },
  {
    id: 3,
    title: 'Cozy 1BR Near Subway',
    price: 1600,
    address: '153-40 Northern Blvd, Flushing, NY',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    images: [
      'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.6,
    reviews: 18,
    description: 'Quiet one-bedroom along Northern Blvd with easy bus transfer to Main St station. Ideal starter home.',
    amenities: ['Elevator', 'On-site laundry', 'Secure entry', 'Renovated kitchen', 'Hardwood floors'],
    landlord: {
      name: 'Mr. Zhang',
      rating: 4.7,
      reviews: 57,
      responseTime: 'Usually replies same day',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    },
  },
  {
    id: 4,
    title: 'Family Apartment - Great Schools',
    price: 2800,
    address: '25-21 Bowne St, Flushing, NY',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    images: [
      'https://images.unsplash.com/photo-1545545741-2ea3ebf61fa3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviews: 31,
    description: 'Bright 2BR near Bowne Park with excellent school zoning and a short ride to downtown Flushing.',
    amenities: ['Dishwasher', 'Washer/Dryer', 'Balcony', 'Parking available', 'Central AC', 'Pet friendly'],
    landlord: {
      name: 'Mrs. Wu',
      rating: 4.8,
      reviews: 73,
      responseTime: 'Usually replies within a few hours',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
    },
  },
  {
    id: 5,
    title: 'Elegant 2BR Condo',
    price: 2200,
    address: '38-02 Union St, Flushing, NY',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.5,
    reviews: 12,
    description: 'Updated condo just off Union St with open layout and sunny bedrooms. Walk to supermarkets and cafes.',
    amenities: ['Elevator', 'Doorman', 'Gym access', 'Central AC', 'Hardwood floors'],
    landlord: {
      name: 'Mr. Lee',
      rating: 4.6,
      reviews: 45,
      responseTime: 'Replies within 4 hours',
      avatar: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&h=100&fit=crop',
    },
  },
  {
    id: 6,
    title: 'Spacious 3BR House',
    price: 3600,
    address: '45-88 Bell Blvd, Flushing, NY',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    images: [
      'https://images.unsplash.com/photo-1512917774080-9b274b3f1ab3?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.8,
    reviews: 28,
    description: 'Detached house near Bayside/Flushing border with driveway parking and renovated kitchen.',
    amenities: ['Driveway parking', 'Dishwasher', 'Washer/Dryer', 'Backyard', 'Central AC'],
    landlord: {
      name: 'Ms. Park',
      rating: 4.9,
      reviews: 64,
      responseTime: 'Usually replies within 1 hour',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    },
  },
  {
    id: 7,
    title: 'Contemporary Studio',
    price: 1500,
    address: '35-16 Parsons Blvd, Flushing, NY',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 500,
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.7,
    reviews: 20,
    description: 'Efficient studio along Parsons Blvd with south-facing windows and new appliances.',
    amenities: ['Elevator', 'Laundry room', 'Secure entry', 'Renovated bath'],
    landlord: {
      name: 'Mr. Gao',
      rating: 4.7,
      reviews: 39,
      responseTime: 'Replies within a few hours',
      avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=100&h=100&fit=crop',
    },
  },
  {
    id: 8,
    title: 'Waterfront 2BR',
    price: 3200,
    address: '201 Willets Point Blvd, Flushing, NY',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1600,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&h=600&fit=crop',
    ],
    rating: 4.9,
    reviews: 35,
    description: 'Waterfront living near Citi Field and Marina. Spacious layout with skyline views.',
    amenities: ['Waterfront views', 'Gym', 'Doorman', 'Parking available', 'Central AC', 'Washer/Dryer'],
    landlord: {
      name: 'Ms. Rivera',
      rating: 4.9,
      reviews: 88,
      responseTime: 'Usually replies within 2 hours',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop',
    },
  },
];

export default function PropertyDetail({ params }: { params: { id: string } }) {
  const [liked, setLiked] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { language } = useI18n();

  const property = propertyData.find((p) => p.id === parseInt(params.id, 10)) || propertyData[0];

  // 所有label和静态文本优先用英文
  const labels = {
    back: 'Back',
    bedrooms: 'Bedrooms',
    baths: 'Baths',
    sqft: 'Sqft',
    basedOn: 'Based on',
    reviews: 'reviews',
    about: 'About this home',
    amenities: 'Amenities',
    landlordInfo: language === 'zh' ? '房东信息' : 'Landlord Info',
    responseTime: 'Response time',
    recentReviews: 'Recent reviews',
    greatStay: 'Great stay',
    messageLandlord: 'Message landlord',
    applyNow: 'Apply now',
    addressNote: 'Flushing, Queens · Close to transit & shops',
    priceUnit: '/mo · Flushing, Queens',
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">{labels.back}</span>
          </Link>
          <button
            onClick={() => setLiked(!liked)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className={`w-6 h-6 ${liked ? 'text-red-500' : 'text-gray-600'}`}
              fill={liked ? 'currentColor' : 'none'}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* 图片轮播 */}
        <div className="relative bg-black h-64 overflow-hidden">
          <img
            src={property.images[selectedImage]}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <Image
            src={property.images[selectedImage]}
            alt={property.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
          {/* 图片指示器 */}
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-2">
            {property.images.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  selectedImage === index ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
          {/* 小图预览 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-3 py-2 flex gap-2 overflow-x-auto">
            {property.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-12 h-12 rounded border-2 overflow-hidden transition-colors ${
                  selectedImage === index ? 'border-white' : 'border-white/30 hover:border-white/50'
                }`}
              >
                <Image src={image} alt="" width={48} height={48} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* 房产信息 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
            <span className="text-gray-500">{labels.priceUnit}</span>
          </div>

          {/* 基本信息 */}
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.bedrooms}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.baths}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{property.sqft}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.sqft}</p>
            </div>
          </div>

          {/* 位置 */}
          <div className="flex items-start gap-3 mt-4 pt-4 border-t border-gray-100">
            <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <p className="font-medium text-gray-900">{property.address}</p>
              <p className="text-sm text-gray-500 mt-1">{labels.addressNote}</p>
            </div>
          </div>

          {/* 评分 */}
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-gray-900">{property.rating}</span>
            </div>
            <span className="text-sm text-gray-500">{labels.basedOn} {property.reviews} {labels.reviews}</span>
          </div>
        </div>

        {/* 描述 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-2">{labels.about}</h2>
          <p className="text-gray-600 text-sm leading-6">{property.description}</p>
        </div>

        {/* 设施 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">{labels.amenities}</h2>
          <div className="grid grid-cols-2 gap-3">
            {property.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-gray-700">{amenity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 房东信息 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">{labels.landlordInfo}</h2>
          <div className="flex items-start gap-3">
            <img
              src={property.landlord.avatar}
              alt={property.landlord.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900">{property.landlord.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-gray-900">{property.landlord.rating}</span>
                <span className="text-sm text-gray-500">({property.landlord.reviews} {labels.reviews})</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{property.landlord.responseTime}</p>
            </div>
          </div>
        </div>

        {/* 评价 */}
        <div className="bg-white px-4 py-4 mt-2 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 mb-4">{labels.recentReviews}</h2>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="pb-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <svg key={j} className="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{labels.greatStay}</span>
                </div>
                <p className="text-sm text-gray-700 mt-2">Clean home, responsive landlord, and super convenient to transit and food in Flushing.</p>
                <p className="text-xs text-gray-500 mt-2">Alice · 2 months ago</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 底部固定按钮 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-4 max-w-md mx-auto">
        <div className="flex gap-3">
          <button className="flex-1 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            {labels.messageLandlord}
          </button>
          <button className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
            {labels.applyNow}
          </button>
        </div>
      </div>
    </div>
  );
}
