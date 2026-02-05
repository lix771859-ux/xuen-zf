'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import ImageCarousel from '@/components/ImageCarousel';

interface PropertyForm {
  title: string;
  description?: string;
  price: number;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  area?: string;
  images?: string[];
  videos?: string[];
}

export default function MyPropertiesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [properties, setProperties] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PropertyForm | null>(null);
  const [loading, setLoading] = useState(true);

  // 删除房源
  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除该房源吗？')) return;
    await fetch(`/api/properties?id=${id}`, { method: 'DELETE' });
    fetch(`/api/properties?landlord_id=${userId}&page=1&pageSize=20`)
      .then((r) => r.json())
      .then((res) => setProperties(res.data ?? []))
      .catch(() => {});
  };

  // 编辑弹窗相关
  const openEdit = (p: any) => {
    setEditId(p.id);
    setEditForm({
      title: p.title,
      description: p.description,
      price: Number(p.price),
      address: p.address,
      bedrooms: p.bedrooms,
      bathrooms: p.bathrooms,
      sqft: p.sqft,
      area: p.area,
      images: p.images || [],
      videos: p.videos || [],
    });
  };

  const closeEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => prev ? {
      ...prev,
      [name]: ['price', 'bedrooms', 'bathrooms', 'sqft'].includes(name)
        ? (value === '' ? undefined : Number(value))
        : value,
    } : prev);
  };

  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const isVideo = file.type.startsWith('video/');
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `images/${fileName}`;

      const { data, error } = await supabaseBrowser.storage
        .from("property-images")
        .upload(filePath, file);

      if (error) {
        alert(`第 ${i + 1} 个文件上传失败`);
        continue;
      }

      const { data: publicUrlData } = supabaseBrowser.storage
        .from('property-images')
        .getPublicUrl(filePath);

      if (isVideo) {
        // 编辑时视频同样只保存在 Supabase
        setEditForm((prev) =>
          prev
            ? {
                ...prev,
                videos: [...(prev.videos || []), publicUrlData.publicUrl],
              }
            : prev
        );
        continue;
      }

      uploadedUrls.push(publicUrlData.publicUrl);
    }

    setEditForm((prev) =>
      prev ? { ...prev, images: [...(prev.images || []), ...uploadedUrls] } : prev
    );
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editId) return;
    await fetch(`/api/properties`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editId,
        title: editForm.title,
        description: editForm.description,
        price: editForm.price,
        address: editForm.address,
        bedrooms: editForm.bedrooms,
        bathrooms: editForm.bathrooms,
        sqft: editForm.sqft,
        area: editForm.area,
        images: editForm.images || [],
        videos: editForm.videos || [],
        landlord_id: userId,
      }),
    });
    closeEdit();
    fetch(`/api/properties?landlord_id=${userId}&page=1&pageSize=20`)
      .then((r) => r.json())
      .then((res) => setProperties(res.data ?? []))
      .catch(() => {});
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user?.id) {
        router.push('/auth');
        return;
      }
      setUserId(data.user?.id ?? null);
      if (data.user?.id) {
        try {
          const response = await fetch(`/api/properties?landlord_id=${data.user.id}&page=1&pageSize=20`);
          const res = await response.json();
          console.log('房源数据:', res);
          setProperties(res.data ?? []);
        } catch (error) {
          console.error('加载房源失败:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4 relative bg-white min-h-screen">
      {/* 返回按钮 */}
      <button
        onClick={() => router.back()}
        className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        返回
      </button>


      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">暂无房源</p>
          <button
            onClick={async () => {
              const { data } = await supabaseBrowser.auth.getUser();
              if (!data.user?.id) {
                alert('请先登录后再发布房源');
                router.push('/auth');
                return;
              }
              router.push('/landlord/properties');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            发布新房源
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {properties.map((p) => (
            <div key={p.id} className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="relative">
                {/* 房源图片轮播 */}
                {p.images && p.images.length > 0 ? (
                  <ImageCarousel images={p.images} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">暂无图片</span>
                  </div>
                )}

                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    className="px-2.5 py-1.5 text-sm bg-white/90 text-gray-900 rounded-md shadow-sm hover:bg-white transition"
                    onClick={() => openEdit(p)}
                  >
                    编辑
                  </button>
                  <button
                    className="px-2.5 py-1.5 text-sm bg-white/90 text-red-600 rounded-md shadow-sm hover:bg-white transition"
                    onClick={() => handleDelete(p.id)}
                  >
                    删除
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3">
                <h3 className="font-semibold text-lg text-gray-900">{p.title}</h3>
                <p className="text-2xl text-lg text-blue-600">¥{Number(p.price)}</p>
                {p.address && <p className="text-lg text-gray-600">{p.address}</p>}
                {p.description && <p className="text-lg text-gray-600">{p.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 编辑弹窗 */}
      {editId && editForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl space-y-3 relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={closeEdit}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            <h3 className="text-lg font-bold mb-4">编辑房源</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">标题</label>
                <input
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">价格</label>
                <input
                  type="number"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                  required
                  min={0}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">卧室数</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={editForm.bedrooms === undefined ? '' : editForm.bedrooms}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">卫生间数</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={editForm.bathrooms === undefined ? '' : editForm.bathrooms}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">面积 (sqft)</label>
                <input
                  type="number"
                  name="sqft"
                  value={editForm.sqft === undefined ? '' : editForm.sqft}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">区域</label>
                <input
                  name="area"
                  value={editForm.area || ''}
                  onChange={handleEditChange}
                  className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">地址</label>
              <input
                name="address"
                value={editForm.address || ''}
                onChange={handleEditChange}
                className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">描述</label>
              <textarea
                name="description"
                value={editForm.description || ''}
                onChange={handleEditChange}
                className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">图片上传</label>
              <div className="mt-2">
                <label htmlFor="edit-property-image-upload">
                  <div className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                    <div className="text-4xl text-gray-400 mb-2">+</div>
                    <div className="text-sm text-gray-600">点击选择图片（可多选）</div>
                  </div>
                  <input
                    id="edit-property-image-upload"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    onChange={handleEditImageChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* 已上传图片预览 */}
              {editForm.images && editForm.images.length > 0 && (
                <div className="mt-4 border-2 border-gray-300 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">已上传图片（{editForm.images.length}张）</p>
                  <ImageCarousel images={editForm.images} className="w-full mb-3" />
                  <div className="flex flex-wrap gap-2">
                    {editForm.images.map((img, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setEditForm(prev => prev ? {
                          ...prev,
                          images: prev.images?.filter((_, i) => i !== idx) || []
                        } : prev)}
                        className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                      >
                        删除第{idx + 1}张
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              保存
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
