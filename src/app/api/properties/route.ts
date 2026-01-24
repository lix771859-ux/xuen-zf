import { NextResponse } from 'next/server';

// Flushing, Queens, NY Properties
const allProperties = [
  {
    id: 1,
    title: 'Modern Studio - Near Main St',
    price: 1800,
    address: '133-25 Roosevelt Ave, Flushing',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 550,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 24,
    area: 'downtown',
  },
  {
    id: 2,
    title: 'Luxury 3BR Townhouse',
    price: 4500,
    address: '41-20 Murray St, Flushing',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2000,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 42,
    area: 'north',
  },
  {
    id: 3,
    title: 'Cozy 1BR Near Subway',
    price: 1600,
    address: '153-40 Northern Blvd, Flushing',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 600,
    image: 'https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=500&h=500&fit=crop',
    rating: 4.6,
    reviews: 18,
    area: 'east',
  },
  {
    id: 4,
    title: 'Family Apartment - Great Schools',
    price: 2800,
    address: '25-21 Bowne St, Flushing',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1400,
    image: 'https://images.unsplash.com/photo-1545545741-2ea3ebf61fa3?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 31,
    area: 'downtown',
  },
  {
    id: 5,
    title: 'Elegant 2BR Condo',
    price: 2200,
    address: '38-02 Union St, Flushing',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 900,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 12,
    area: 'west',
  },
  {
    id: 6,
    title: 'Spacious 3BR House',
    price: 3600,
    address: '45-88 Bell Blvd, Flushing',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    image: 'https://images.unsplash.com/photo-1512917774080-9b274b3f1ab3?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 28,
    area: 'north',
  },
  {
    id: 7,
    title: 'Contemporary Studio',
    price: 1500,
    address: '35-16 Parsons Blvd, Flushing',
    bedrooms: 0,
    bathrooms: 1,
    sqft: 500,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 20,
    area: 'east',
  },
  {
    id: 8,
    title: 'Waterfront 2BR',
    price: 3200,
    address: '201 Willets Point Blvd, Flushing',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1600,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 35,
    area: 'south',
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');
  const minPrice = parseInt(searchParams.get('minPrice') || '0');
  const maxPrice = parseInt(searchParams.get('maxPrice') || '999999');
  const bedrooms = searchParams.get('bedrooms');
  const area = searchParams.get('area');
  const search = searchParams.get('search') || '';

  // 过滤数据
  let filtered = allProperties.filter((property) => {
    if (search && !property.title.toLowerCase().includes(search.toLowerCase()) &&
        !property.address.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    if (property.price < minPrice || property.price > maxPrice) {
      return false;
    }
    if (bedrooms && property.bedrooms !== parseInt(bedrooms)) {
      return false;
    }
    if (area && property.area !== area) {
      return false;
    }
    return true;
  });

  // 分页
  const total = filtered.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filtered.slice(start, end);

  return NextResponse.json({
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  });
}
