'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [isLandlord, setIsLandlord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error: err } = await supabaseBrowser.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (err) throw err;
        // 登录成功
        router.push('/');
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error('两次输入的密码不一致');
        }

        const { data, error: err } = await supabaseBrowser.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: { name: formData.name },
          },
        });
        if (err) throw err;

        // 提示邮箱验证（若开启）
        alert('注册成功！如果启用了邮箱验证，请查收邮件完成激活。');
        router.push('/');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* 标题 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h12a1 1 0 001-1V9m-9 5h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">租房 APP</h1>
          <p className="text-gray-500 mt-1">找到你的理想家园</p>
        </div>

        {/* 标签切换 */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => {
              setIsLogin(true);
              setFormData({ email: '', password: '', confirmPassword: '', name: '' });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setFormData({ email: '', password: '', confirmPassword: '', name: '' });
            }}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              !isLogin
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            注册
          </button>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名字（仅注册） */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="请输入你的姓名"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          {/* 邮箱 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 密码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="至少 6 个字符"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* 确认密码（仅注册） */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                确认密码
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="再次输入密码"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isLogin}
              />
            </div>
          )}

          {/* 我是房东（仅注册） */}
          {!isLogin && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isLandlord"
                checked={isLandlord}
                onChange={(e) => setIsLandlord(e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isLandlord" className="text-sm text-gray-600">
                我是房东
              </label>
            </div>
          )}

          {/* 记住我（仅登录） */}
          {isLogin && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                记住我
              </label>
            </div>
          )}

          {/* 提交按钮 */}
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors mt-6 disabled:opacity-60"
          >
            {loading ? '处理中…' : (isLogin ? '登录' : '注册')}
          </button>
        </form>

        {/* 底部链接 */}
        {isLogin && (
          <p className="text-center text-sm text-gray-600 mt-4">
            忘记密码？{' '}
            <button
              onClick={async () => {
                if (!formData.email) {
                  alert('请先填写邮箱');
                  return;
                }
                const { error: err } = await supabaseBrowser.auth.resetPasswordForEmail(formData.email);
                if (err) {
                  alert('发送失败：' + err.message);
                } else {
                  alert('重置邮件已发送，请检查邮箱');
                }
              }}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              重置
            </button>
          </p>
        )}

        {/* 社交登录 */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">或</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button
              type="button"
              className="py-2 px-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>

        {/* 服务条款 */}
        <p className="text-center text-xs text-gray-500 mt-6">
          继续表示你同意{' '}
          <button className="text-blue-600 hover:underline">服务条款</button>
          {' '}和{' '}
          <button className="text-blue-600 hover:underline">隐私政策</button>
        </p>

        {/* 返回首页 */}
        <Link
          href="/"
          className="block text-center text-sm text-blue-600 hover:text-blue-700 mt-4 font-medium"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
