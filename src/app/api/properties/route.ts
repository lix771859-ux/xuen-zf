import { NextResponse } from 'next/server';

// 模拟数据库中的房产数据
const allProperties = [
  {
    id: 1,
    title: '现代公寓 - 市中心',
    price: 4500,
    address: '中山路123号',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 24,
    area: 'downtown',
  },
  {
    id: 2,
    title: '豪华别墅 - 安静社区',
    price: 8500,
    address: '绿岛路456号',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3500,
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=500&h=500&fit=crop',
    rating: 4.9,
    reviews: 42,
    area: 'south',
  },
  {
    id: 3,
    title: '温馨一室 - 靠近地铁',
    price: 2800,
    address: '翠景路789号',
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
    title: '家庭公寓 - 靠近学校',
    price: 5200,
    address: '学府街321号',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1800,
    image: 'https://images.unsplash.com/photo-1545545741-2ea3ebf61fa3?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 31,
    area: 'north',
  },
  {
    id: 5,
    title: '精致小公寓',
    price: 3200,
    address: '文化街100号',
    bedrooms: 1,
    bathrooms: 1,
    sqft: 800,
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=500&fit=crop',
    rating: 4.5,
    reviews: 12,
    area: 'downtown',
  },
  {
    id: 6,
    title: '豪装三室',
    price: 6800,
    address: '翠河道200号',
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2200,
    image: 'https://images.unsplash.com/photo-1512917774080-9b274b3f1ab3?w=500&h=500&fit=crop',
    rating: 4.8,
    reviews: 28,
    area: 'west',
  },
  {
    id: 7,
    title: '现代两室',
    price: 4000,
    address: '技术园路300号',
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1000,
    image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&h=500&fit=crop',
    rating: 4.7,
    reviews: 20,
    area: 'east',
  },
  {
    id: 8,
    title: '湖景房',
    price: 7000,
    address: '湖滨路500号',
    bedrooms: 3,
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
