'use client';

import { useI18n } from '@/i18n/context';
import { Link } from 'lucide-react';

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-50">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
        <a onClick={() => window.history.back()} className="text-blue-600 text-sm">← 返回</a>
        <h1 className="text-lg font-semibold text-gray-900">About Us</h1>
      </div>
      <div className="flex-1 px-4 py-6 text-sm text-gray-700 leading-relaxed">
        <p>这是一个用于发布和查找租房信息的小应用，支持聊天联系房东、收藏房源和多语言切换。</p>
        <p className="mt-3">我叫肖恩，很高兴认识你，我憧憬未来，却不能只靠一双手，希望有机会与你相遇。</p>
        <p className="mt-3">联系电话：9296829058（如有需要，欢迎通过电话联系我）。</p>
        <p className="mt-3">后续会在这里补充更多关于平台和团队的信息。</p>
      </div>
    </div>
  );
}
