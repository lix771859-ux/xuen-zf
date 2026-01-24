-- 法拉盛地区示例房源数据
-- Run in Supabase SQL editor after running schema.sql

INSERT INTO public.properties (title, description, price, address, bedrooms, bathrooms, sqft, area, images) VALUES
('Modern Studio - Near Main St', '舒适的现代单间公寓，靠近法拉盛主街，交通便利，周边餐饮购物齐全。全新装修，设施齐全。', 1800, '133-25 Roosevelt Ave, Flushing, NY 11354', 0, 1, 550, 'downtown', ARRAY['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop']),

('Luxury 3BR Townhouse', '豪华三卧室联排别墅，宽敞明亮，带车库和后院。适合家庭居住，周边学区优秀。', 4500, '41-20 Murray St, Flushing, NY 11354', 3, 2, 2000, 'north', ARRAY['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop']),

('Cozy 1BR Near Subway', '温馨一卧室公寓，步行5分钟到地铁站。楼下就是超市，生活便利。采光好，安静舒适。', 1600, '153-40 Northern Blvd, Flushing, NY 11354', 1, 1, 600, 'east', ARRAY['https://images.unsplash.com/photo-1493857671505-72967e2e2760?w=800&h=600&fit=crop']),

('Family Apartment - Great Schools', '家庭友好型两卧室公寓，靠近优质学区。社区安全，设施完善，带健身房和洗衣房。', 2800, '25-21 Bowne St, Flushing, NY 11354', 2, 2, 1400, 'downtown', ARRAY['https://images.unsplash.com/photo-1545545741-2ea3ebf61fa3?w=800&h=600&fit=crop']),

('Elegant 2BR Condo', '精致两卧室公寓，现代化装修，开放式厨房。楼内有门卫，安全便捷。', 2200, '38-02 Union St, Flushing, NY 11354', 2, 1, 900, 'west', ARRAY['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop']),

('Spacious 3BR House', '宽敞三卧室独立屋，带前后院和车库。社区宁静，适合家庭。近公园和学校。', 3600, '45-88 Bell Blvd, Flushing, NY 11361', 3, 2, 1600, 'north', ARRAY['https://images.unsplash.com/photo-1512917774080-9b274b3f1ab3?w=800&h=600&fit=crop']),

('Contemporary Studio', '时尚单间公寓，全新装修，设备齐全。适合年轻专业人士，靠近商业区。', 1500, '35-16 Parsons Blvd, Flushing, NY 11354', 0, 1, 500, 'east', ARRAY['https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=600&fit=crop']),

('Waterfront 2BR', '滨水两卧室公寓，视野开阔，景色优美。健身中心、游泳池等设施齐全。', 3200, '201 Willets Point Blvd, Flushing, NY 11368', 2, 2, 1600, 'south', ARRAY['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop']),

('Bright 1BR with Balcony', '明亮一卧室公寓，带阳台。楼层高，采光极佳。步行可达多条地铁线。', 1900, '136-20 38th Ave, Flushing, NY 11354', 1, 1, 650, 'downtown', ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop']),

('Renovated 2BR Near Park', '全新装修两卧室，现代厨房和浴室。对面就是法拉盛草原公园，环境优美。', 2500, '45-10 Kissena Blvd, Flushing, NY 11355', 2, 1, 1000, 'east', ARRAY['https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop']),

('Cozy Garden Apartment', '一楼花园公寓，带私家小院。安静舒适，适合喜欢户外空间的租客。', 2100, '147-30 Sanford Ave, Flushing, NY 11355', 2, 1, 850, 'north', ARRAY['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop']),

('Modern 3BR Family Home', '现代化三卧室家庭住宅，全新装修，设施一流。双车位车库，大后院。', 4200, '162-15 Powells Cove Blvd, Flushing, NY 11357', 3, 2, 1800, 'north', ARRAY['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop']);
