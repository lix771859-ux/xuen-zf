'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

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

  const handleSend = async () => {
    if (!message.trim()) return;

    setSending(true);
    try {
      const { error } = await supabaseBrowser
        .from('messages')
        .insert([
          {
            sender_id: currentUserId,
            recipient_id: landlordId,
            text: message,
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
    <div className="fixed bottom-0 left-0 right-0 w-full h-16 bg-white border-t border-gray-200 shadow-lg flex items-center px-4 gap-2 z-40">
      {/* 显示最后一条消息或提示 */}
      <div className="flex-1 min-w-0">
        {messages.length > 0 ? (
          <div className="text-sm">
            <p className="text-gray-600 truncate">{messages[messages.length - 1].text}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-400">点击输入框与房东沟通</p>
        )}
      </div>

      {/* 输入框 */}
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
  );
}
