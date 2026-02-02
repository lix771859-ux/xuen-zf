'use client';

import { useEffect, useState } from 'react';
import { useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import {useRefreshStore } from '@/store/useRefreshStore';
import { mutate } from 'swr';

// 页面初始未登录直接跳转到登录页（放到 useEffect）
// 必须在组件内


interface PropertyForm {
  title: string;
  description?: string;
  price: number;
  address?: string;
  image?: string | null;
  video?: string | null;
}

export default function LandlordPropertiesPage() {

  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();
  const [form, setForm] = useState<PropertyForm>({
    title: '',
    price: undefined as any,
    image: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<PropertyForm | null>(null);
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
      image: p.images?.[0] || p.image || null,
    });
  };
  const closeEdit = () => {
    setEditId(null);
    setEditForm(null);
  };
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditForm((prev) => prev ? { ...prev, [name]: name === 'price' ? Number(value) : value } : prev);
  };
  const handleEditImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // ⭐ 1. 判断文件类型
    if (file.type.startsWith("image/")) {
      // 图片：继续用你原来的 FileReader 预览逻辑
      const reader = new FileReader();
      reader.onload = () => {
        setEditForm((prev) =>
          prev ? { ...prev, image: reader.result as string, video: undefined } : prev
        );
      };
      reader.readAsDataURL(file);

    } else if (file.type.startsWith("video/")) {
      // ⭐ 2. 视频：不能用 FileReader 读成 base64（太大）
      // 直接生成一个本地预览 URL
      const videoUrl = URL.createObjectURL(file);

      setEditForm((prev) =>
        prev ? { ...prev, video: videoUrl, image: undefined } : prev
      );

      // ⭐ 3. 上传视频（你可以按你的逻辑上传）
      // await uploadVideo(file);
    }
  };
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm || !editId) return;
    await fetch(`/api/properties`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editId,
        ...editForm,
        images: editForm.image ? [editForm.image] : [],
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
        setMessage('请先登录后再发布房源，正在跳转到登录页...');
        setTimeout(() => {
          router.push('/auth');
        }, 1200);
        return;
      }
      setUserId(data.user?.id ?? null);
      if (data.user?.id) {
        fetch(`/api/properties?landlord_id=${data.user.id}&page=1&pageSize=20`)
          .then((r) => r.json())
          .then((res) => setProperties(res.data ?? []))
          .catch(() => {});
      }
    };
    init();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'price' ? (value === '' ? undefined : Number(value)) : value,
    }));
  };

  // 图片上传处理
  // ...existing code...
const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = e.target.files;
  if (!files || files.length === 0) return;

  const file = files[0];
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

  // ⭐ 根据文件类型决定上传路径
  const folder = file.type.startsWith("video/") ? "videos" : "images";
  const filePath = `${folder}/${fileName}`;

  // 上传到 Supabase
  const { data, error } = await supabaseBrowser.storage
    .from("property-images")
    .upload(filePath, file);

  if (error) {
    alert("上传失败");
    return;
  }

  // 获取公开 URL
  const { data: publicUrlData } = supabaseBrowser.storage
    .from("property-images")
    .getPublicUrl(filePath);

  // ⭐ 根据文件类型更新不同字段
  setForm(prev => ({
    ...prev,
    image: file.type.startsWith("image/") ? publicUrlData.publicUrl : undefined,
    video: file.type.startsWith("video/") ? publicUrlData.publicUrl : undefined,
  }));
};
// ...existing code...

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          images: form.image ? [form.image] : [form.video],
          // videos: form.video ? [form.video] : [],
          landlord_id: userId,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || '发布失败');
      }
      setMessage('发布成功');
      setForm({ title: '', price: 0, image: null, video: null });
      // 新增后首页刷新
      // useRefreshStore.getState().markShouldRefresh();
      // mutate('/api/properties?page=1&pageSize=6&minPrice=1000&maxPrice=15000')
      fetch(`/api/properties?page=1&pageSize=6&minPrice=1000&maxPrice=15000`)
      .then((r) => r.json())
      .then((res) => setProperties(res.data ?? []))
      .catch(() => {});
      
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
        title="关闭"
        type="button"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h1 className="text-2xl font-bold text-gray-800">房东房源管理</h1>
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
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">图片上传</label>
              <div className="mt-2">
                <label htmlFor="property-image-upload">
                  <div className="w-28 h-28 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden cursor-pointer relative">
                     {form.video ? (
                                    <video
                                      src={form.video}
                                      controls
                                      className="object-cover w-full h-full"
                                    />
                                  ) : form.image ? (
                                    <img
                                      src={form.image}
                                      alt="预览"
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-4xl text-gray-400 select-none">+</span>
                                  )}


                                  <input
                                    id="edit-property-image-upload"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    style={{ width: '100%', height: '100%' }}
                                  />
                  </div>
                </label>
              </div>
            </div>
            {message && <p className="text-sm text-blue-600">{message}</p>}
            <button type="submit" disabled={submitting || !userId} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
              {submitting ? '发布中…' : '发布房源'}
            </button>
          </form>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-gray-800">我的房源</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {properties.map((p) => (
                <div key={p.id} className="border rounded p-3 bg-white relative">
                  {(p.images?.[0] || p.image) && (
                    <img
                      src={p.images?.[0] || p.image}
                      alt="房源图片"
                      className="object-cover w-full h-32 mb-2 rounded"
                    />
                  )}
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-600">¥{Number(p.price)}</div>
                  {p.address && <div className="text-sm text-gray-500">{p.address}</div>}
                  <div className="absolute top-2 right-2 flex gap-2">
                    <button className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded" onClick={() => openEdit(p)}>编辑</button>
                    <button className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded" onClick={() => handleDelete(p.id)}>删除</button>
                  </div>
                </div>
              ))}
                    {/* 编辑弹窗 */}
                    {editId && editForm && (
                      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
                        <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md space-y-3 relative">
                          <button type="button" onClick={closeEdit} className="absolute right-4 top-4 text-gray-400 hover:text-gray-700">✕</button>
                          <h3 className="text-lg font-bold mb-2">编辑房源</h3>
                          <div>
                            <label className="block text-sm font-medium mb-1">标题</label>
                            <input name="title" value={editForm.title} onChange={handleEditChange} className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2" required />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">描述</label>
                            <textarea name="description" value={editForm.description || ''} onChange={handleEditChange} className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">价格</label>
                            <input type="number" name="price" value={editForm.price} onChange={handleEditChange} className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2" required min={0} />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">地址</label>
                            <input name="address" value={editForm.address || ''} onChange={handleEditChange} className="w-full border border-gray-400 text-gray-800 rounded px-3 py-2" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">图片上传</label>
                            <div className="mt-2">
                              <label htmlFor="edit-property-image-upload">
                                <div className="w-28 h-28 bg-gray-100 rounded-lg border flex items-center justify-center overflow-hidden cursor-pointer relative">
                                  {editForm.video ? (
                                    <video
                                      src={editForm.video}
                                      controls
                                      className="object-cover w-full h-full"
                                    />
                                  ) : editForm.image ? (
                                    <img
                                      src={editForm.image}
                                      alt="预览"
                                      className="object-cover w-full h-full"
                                    />
                                  ) : (
                                    <span className="text-4xl text-gray-400 select-none">+</span>
                                  )}


                                  <input
                                    id="edit-property-image-upload"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleEditImageChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    style={{ width: '100%', height: '100%' }}
                                  />
                                </div>
                              </label>
                            </div>
                          </div>
                          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">保存</button>
                        </form>
                      </div>
                    )}
            {properties.length === 0 && (
              <p className="text-sm text-gray-500">暂无房源</p>
            )}
          </div>
          </div>
        </>
      )}
    </div>
  );
}
