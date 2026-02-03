'use client';

import { useState, useEffect, useRef } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';
import { useRouter } from 'next/navigation';

interface ContactLandlordProps {
  landlordId: string;
  propertyTitle: string;
}

interface MessageType {
  id?: number;
  sender_id: string;
  text: string;
  created_at: string;
}

export default function ContactLandlord({ landlordId, propertyTitle }: ContactLandlordProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // 加载消息和订阅实时更新
  useEffect(() => {
    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user?.id) return;

      setCurrentUserId(data.user.id);

      // 加载历史消息
      const { data: historyMessages } = await supabaseBrowser
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${data.user.id},recipient_id.eq.${landlordId}),and(sender_id.eq.${landlordId},recipient_id.eq.${data.user.id})`)
        .order('created_at', { ascending: true });

      if (historyMessages) {
        setMessages(historyMessages);
      }

      // 订阅实时消息
      const subscription = supabaseBrowser
        .channel(`chat:${data.user.id}:${landlordId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id.eq.${data.user.id},recipient_id.eq.${landlordId}),and(sender_id.eq.${landlordId},recipient_id.eq.${data.user.id}))`,
          },
          (payload: any) => {
            setMessages((prev) => [...prev, payload.new]);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    };

    init();
  }, [landlordId]);

  useEffect(() => {
    if (!isExpanded) return;
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isExpanded]);

  const handleContactClick = async () => {
    const { data } = await supabaseBrowser.auth.getUser();
    if (!data.user?.id) {
      const ok = window.confirm('请先登录后再联系房东');
      if (!ok) return;
      router.push('/auth');
      return;
    }
    setCurrentUserId(data.user.id);
    setIsExpanded(true);
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    // 检查是否登录
    const { data } = await supabaseBrowser.auth.getUser();
    if (!data.user?.id) {
      const ok = window.confirm('请先登录后再发送消息');
      if (!ok) return;
      router.push('/auth');
      return;
    }

    setSending(true);
    try {
      const { error } = await supabaseBrowser
        .from('messages')
        .insert([
          {
            sender_id: currentUserId,
            recipient_id: landlordId,
            text: message,
            property_title: propertyTitle,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('发送失败:', error);
        return;
      }

      setMessage('');
    } catch (err) {
      console.error('错误:', err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg z-40">
      {!isExpanded ? (
        <div className="h-16 flex items-center px-4">
          <button
            onClick={handleContactClick}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm"
          >
            联系房东
          </button>
        </div>
      ) : (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          {/* 顶部栏 */}
          <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between">
            <span className="font-semibold text-gray-900">与房东对话</span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-blue-600 text-sm font-medium"
            >
              关闭
            </button>
          </div>

          {/* 消息列表（全屏可滚动） */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => {
                const isMine = msg.sender_id === currentUserId;
                return (
                  <div key={msg.id ?? `${msg.created_at}-${index}`} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={
                        isMine
                          ? 'bg-blue-600 text-white px-3 py-2 rounded-2xl text-sm max-w-[75%]'
                          : 'bg-gray-100 text-gray-900 px-3 py-2 rounded-2xl text-sm max-w-[75%]'
                      }
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-gray-400">还没有消息，开始联系房东吧</p>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* 输入框 */}
          <div className="px-4 py-3 border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') handleSend();
              }}
              placeholder="输入消息..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm disabled:opacity-60 whitespace-nowrap"
            >
              发送
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
