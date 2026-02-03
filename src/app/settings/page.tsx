'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/i18n/context';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useSupabaseUser } from '@/hooks/useSupabaseUser';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

export default function SettingsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { user } = useSupabaseUser();

  const [settingsEmail, setSettingsEmail] = useState('');
  const [settingsPhone, setSettingsPhone] = useState('');
  const [settingsPassword, setSettingsPassword] = useState('');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [settingsMessage, setSettingsMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    setSettingsEmail(user.email ?? '');
    const meta = (user as any).user_metadata || {};
    setSettingsPhone(meta.phone ?? '');
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) {
      setSettingsError('请先登录后再修改账号信息');
      return;
    }

    setSavingSettings(true);
    setSettingsError(null);
    setSettingsMessage(null);

    try {
      const payload: any = {
        data: {
          ...((user as any).user_metadata || {}),
          phone: settingsPhone || null,
        },
      };

      if (settingsEmail && settingsEmail !== user.email) {
        payload.email = settingsEmail;
      }

      const trimmedPassword = settingsPassword.trim();
      if (trimmedPassword) {
        payload.password = trimmedPassword;
      }

      const { error } = await supabaseBrowser.auth.updateUser(payload);
      if (error) throw error;

      setSettingsMessage('设置已保存');
      setSettingsPassword('');
    } catch (err: any) {
      setSettingsError(err.message || '保存失败，请稍后重试');
    } finally {
      setSavingSettings(false);
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/?tab=profile')}
            className="text-blue-600 text-sm"
          >
            ← 返回
          </button>
          <h1 className="text-lg font-semibold text-gray-900">{t('settings')}</h1>
        </div>
        <LanguageSwitcher />
      </div>

      {/* 内容 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="p-4 rounded-lg border border-gray-200 bg-white flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-900">界面语言</span>
            <span className="text-xs text-gray-400 mt-0.5">切换应用显示的语言</span>
          </div>
          <LanguageSwitcher />
        </div>

        <div className="p-4 rounded-lg border border-gray-200 bg-white space-y-3">
          <p className="text-sm font-medium text-gray-900 mb-1">账号与联系方式</p>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">手机号码</label>
            <input
              type="tel"
              value={settingsPhone}
              onChange={(e) => setSettingsPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入手机号"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">登录邮箱</label>
            <input
              type="email"
              value={settingsEmail}
              onChange={(e) => setSettingsEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="请输入新的邮箱（如需修改）"
            />
            <p className="text-[11px] text-gray-400">修改邮箱后，可能需要通过邮件确认。</p>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-gray-500">新密码</label>
            <input
              type="password"
              value={settingsPassword}
              onChange={(e) => setSettingsPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="留空则不修改密码"
            />
          </div>

          {settingsError && (
            <p className="text-xs text-red-500 mt-1">{settingsError}</p>
          )}
          {settingsMessage && (
            <p className="text-xs text-green-600 mt-1">{settingsMessage}</p>
          )}

          <button
            onClick={handleSaveSettings}
            disabled={savingSettings}
            className="w-full mt-1 px-3 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-60"
          >
            {savingSettings ? '保存中…' : '保存账号设置'}
          </button>
        </div>
      </div>
    </div>
  );
}
