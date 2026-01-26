
// 'use client';

// import { useState } from 'react';
// import { useI18n } from '@/i18n/context';
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

export default async function PropertyDetail({ params }: { params: { id: string } }) {
  const { id } = await params;
  const property = propertyData.find((p) => p.id === parseInt(id, 10)) || propertyData[0];
  return (
    <div className="min-h-screen bg-white pb-10">
      {/* 返回按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center">
          <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-medium">返回</span>
          </Link>
        </div>
      </div>
      <div className="max-w-md mx-auto">
        {/* 图片展示 */}
        <div className="relative bg-black h-64 overflow-hidden mb-4">
          <Image
            src={property.images[0]}
            alt={property.title}
            width={800}
            height={600}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        {/* 房产信息 */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-bold text-blue-600">${property.price.toLocaleString()}</span>
            <span className="text-gray-500">/月</span>
          </div>
          <div className="flex flex-wrap gap-4 mb-2">
            <span className="text-gray-700">{property.address}</span>
            <span className="text-gray-700">{property.sqft} 平方尺</span>
            <span className="text-gray-700">{property.bedrooms} 室 {property.bathrooms} 卫</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-700">评分：{property.rating}（{property.reviews}条评价）</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-700">{property.description}</span>
          </div>
          <div className="mb-2">
            <span className="text-gray-700">配套：{property.amenities?.join('、')}</span>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <img src={property.landlord.avatar} alt={property.landlord.name} className="w-10 h-10 rounded-full" />
            <div>
              <div className="font-medium text-gray-900">房东：{property.landlord.name}</div>
              <div className="text-xs text-gray-500">房东评分：{property.landlord.rating}（{property.landlord.reviews}条）</div>
              <div className="text-xs text-gray-500">{property.landlord.responseTime}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

