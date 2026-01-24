'use client';

import { useEffect, useState } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface PropertyForm {
  title: string;
  description?: string;
  price: number;
  address?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sqft?: number | null;
  area?: string | null;
  images?: string[] | null;
}

export default function LandlordPropertiesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [form, setForm] = useState<PropertyForm>({
    title: '',
    price: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
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
      [name]: name === 'price' || name === 'bedrooms' || name === 'bathrooms' || name === 'sqft' ? Number(value) : value,
    }));
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const arr = value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    setForm((prev) => ({ ...prev, images: arr.length ? arr : null }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      if (!userId) {
        setMessage('请先登录再发布房源');
        return;
      }
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, landlord_id: userId }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || '发布失败');
      }
      setMessage('发布成功');
      setProperties((prev) => [json.data, ...prev]);
      setForm({ title: '', price: 0 });
    } catch (err: any) {
      setMessage(err.message || '发布失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">房东房源管理</h1>

      {!userId && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
          请先登录，以发布和管理房源。
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg border space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1">标题</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">描述</label>
          <textarea name="description" value={form.description || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">价格</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">地址</label>
            <input name="address" value={form.address || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">卧室</label>
            <input type="number" name="bedrooms" value={form.bedrooms ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">卫生间</label>
            <input type="number" name="bathrooms" value={form.bathrooms ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">面积 (sqft)</label>
            <input type="number" name="sqft" value={form.sqft ?? ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">区域</label>
            <input name="area" value={form.area || ''} onChange={handleChange} className="w-full border rounded px-3 py-2" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">图片 URLs（逗号分隔）</label>
          <input onChange={handleImagesChange} className="w-full border rounded px-3 py-2" />
        </div>
        {message && <p className="text-sm text-blue-600">{message}</p>}
        <button type="submit" disabled={submitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60">
          {submitting ? '发布中…' : '发布房源'}
        </button>
      </form>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">我的房源</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {properties.map((p) => (
            <div key={p.id} className="border rounded p-3 bg-white">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">¥{Number(p.price)}</div>
              {p.address && <div className="text-sm text-gray-500">{p.address}</div>}
            </div>
          ))}
          {properties.length === 0 && (
            <p className="text-sm text-gray-500">暂无房源</p>
          )}
        </div>
      </div>
    </div>
  );
}
