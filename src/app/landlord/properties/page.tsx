'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import {useRefreshStore } from '@/store/useRefreshStore';
import { mutate } from 'swr';
import ImageCarousel from '@/components/ImageCarousel';

// 页面初始未登录直接跳转到登录页（放到 useEffect）
// 必须在组件内


interface PropertyForm {
  title: string;
  description?: string;
  price: number;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  area?: string;
  images?: string[]; // 多个图片
  image?: string | null; // 兼容旧数据
  video?: string | null;
}

export default function LandlordPropertiesPage() {

  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState<PropertyForm>({
    title: '',
    price: undefined as any,
    bedrooms: undefined as any,
    bathrooms: undefined as any,
    sqft: undefined as any,
    area: '',
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  // 删除房源
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该房源吗？')) return;
    await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
  };

  // 编辑弹窗相关
  const openEdit = (p: any) => {
    // 跳转到房源管理页面
  };
  const closeEdit = () => {
    // 关闭编辑
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // 编辑表单变化
  };
  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 编辑图片变化
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    // 编辑提交
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user?.id) {
        setMessage('请先登录后再发布房源，正在跳转到登录页...');
        setTimeout(() => {
          router.push('/auth');
        }, 1200);
        return;
      }
      setUserId(data.user?.id ?? null);
    };
    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: ['price', 'bedrooms', 'bathrooms', 'sqft'].includes(name)
        ? (value === '' ? undefined : Number(value))
        : value,
    }));
  };

  // 图片 / 视频上传处理 - 支持多个文件
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];

    // 批量上传选中的文件
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}-${i}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error } = await supabaseBrowser.storage
        .from("property-images")
        .upload(filePath, file);

      if (error) {
        alert(`第 ${i + 1} 个文件上传失败`);
        continue;
      }

      // 如果是视频文件，上传到 YouTube
      if (isVideo) {
        try {
          const res = await fetch('/api/youtube/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bucket: 'property-images',
              path: filePath,
              title: form.title || '房源视频',
              description: form.description || '',
            }),
          });
          const json = await res.json();
          if (!res.ok) {
            console.error('YouTube 上传失败:', json);
          } else {
            console.log('YouTube 上传成功:', json);
            // 如果以后需要在表里保存视频 URL，可以在这里 setForm({ video: json.url })
          }
        } catch (err) {
          console.error('调用 YouTube 上传接口出错:', err);
        }
        // 视频不加入 images 列表，避免被当作图片渲染
        continue;
      }

      const { data: publicUrlData } = supabaseBrowser.storage
        .from('property-images')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    // 将上传的图片添加到列表
    setForm((prev) => ({
      ...prev,
      images: [...(prev.images || []), ...uploadedUrls],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          price: form.price,
          address: form.address,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          sqft: form.sqft,
          area: form.area,
          images: form.images || [],
          landlord_id: userId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || '发布失败');
      }
      setMessage('发布成功');
      setForm({
        title: '',
        description: '',
        price: undefined as any,
        address: '',
        bedrooms: undefined as any,
        bathrooms: undefined as any,
        sqft: undefined as any,
        area: '',
        images: [],
        image: null,
        video: null,
      });
      mutate('/api/properties?page=1&pageSize=6&minPrice=1000&maxPrice=15000')

      router.push('/');
    } catch (err: any) {
      setMessage(err.message || '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6 relative bg-white min-h-screen">
      {/* 关闭按钮 */}
      <button
        onClick={() => router.back()}
        className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 bg-white rounded-full border border-gray-200 w-9 h-9 flex items-center justify-center shadow-sm z-10"
        title="close"
        type="button"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-gray-800">出租房源</h1>
      {/* 登录提示 */}
      {!userId && (
        <div className="p-4 text-gray-800 bg-yellow-50 border border-yellow-200 rounded">
          请先登录，即将跳到登录页。。。
        </div>
      )}
      {/* 表单和房源列表 */}
      {userId && (
        <>
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">标题</label>
              <input name="title" value={form.title} onChange={handleChange} className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2" required placeholder="请输入标题" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">描述</label>
              <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2" placeholder="请输入描述" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">价格</label>
                <input
                  type="number"
                  name="price"
                  value={form.price === undefined ? '' : form.price}
                  onChange={handleChange}
                  className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2" 
                  required
                  min={0}
                  placeholder="请输入价格"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">地址</label>
                <input name="address" value={form.address || ''} onChange={handleChange} className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2" placeholder="请输入地址" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">卧室数</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={form.bedrooms === undefined ? '' : form.bedrooms}
                  onChange={handleChange}
                  className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2"
                  min={0}
                  placeholder="如 2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">卫生间数</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={form.bathrooms === undefined ? '' : form.bathrooms}
                  onChange={handleChange}
                  className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2"
                  min={0}
                  placeholder="如 1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">面积 (sqft)</label>
                <input
                  type="number"
                  name="sqft"
                  value={form.sqft === undefined ? '' : form.sqft}
                  onChange={handleChange}
                  className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2"
                  min={0}
                  placeholder="如 80"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">区域</label>
                <input
                  name="area"
                  value={form.area || ''}
                  onChange={handleChange}
                  className="w-full border border-gray-400 text-gray-800 placeholder-gray-500 rounded px-3 py-2"
                  placeholder="如 downtown / north"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">图片上传</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {/* 上传按钮 */}
                <label htmlFor="property-image-upload" >
                  <div className="w-25 h-25 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <div className="text-4xl text-gray-400 mb-2">+</div>
                    <div className="text-sm text-gray-600">点击上传</div>
                  </div>
                  <input
                    id="property-image-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                
                {/* 已上传图片预览 */}
                {form.images && form.images.length > 0 && form.images.map((img, idx) => (
                  <div key={idx} className="relative w-25 h-25 border-2 border-gray-300 rounded-lg overflow-hidden group">
                    <img src={img} alt={`图片${idx + 1}`} className="w-25 h-25 object-cover" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setForm(prev => ({
                          ...prev,
                          images: prev.images?.filter((_, i) => i !== idx) || []
                        }));
                      }}
                      className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {message && <p className="text-sm text-blue-600">{message}</p>}
            <div className="flex gap-2">
              <button type="submit" disabled={submitting || !userId} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60 hover:bg-blue-700">
                {submitting ? '发布中…' : '发布房源'}
              </button>
              <button
                type="button"
                onClick={() => router.push('/landlord/my-properties')}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                我的房源
              </button>
            </div>
          </form>
          </>
      )}
    </div>
  );
}
