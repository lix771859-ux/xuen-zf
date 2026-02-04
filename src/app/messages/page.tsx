'use client';

import { useState, useEffect } from 'react';
import { supabaseBrowser } from '@/lib/supabaseBrowser';

interface MessageType {
  id?: number;
  sender_id: string;
  recipient_id?: string;
  text: string;
  created_at: string;
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  messages: MessageType[];
}

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // 获取当前用户和消息
  useEffect(() => {
    let subscription: any;

    const init = async () => {
      const { data } = await supabaseBrowser.auth.getUser();
      if (!data.user?.id) return;

      setCurrentUserId(data.user.id);

      // 加载初始消息
      const { data: messages, error } = await supabaseBrowser
        .from('messages')
        .select('*')
        .or(`recipient_id.eq.${data.user.id},sender_id.eq.${data.user.id}`)
        .order('created_at', { ascending: true });

      console.log('当前用户ID:', data.user.id);
      console.log('查询到的消息:', messages);
      console.log('查询错误:', error);

      if (error) {
        console.error('加载消息失败:', error);
        setLoading(false);
        return;
      }

      // 按发送者或接收者分组
      const conversationMap: { [key: string]: MessageType[] } = {};
      messages?.forEach((msg: any) => {
        const otherId = msg.sender_id === data.user.id ? msg.recipient_id : msg.sender_id;
        if (!conversationMap[otherId]) {
          conversationMap[otherId] = [];
        }
        conversationMap[otherId].push(msg);
      });

      // 转换为对话列表
      const convList = Object.entries(conversationMap).map(([userId, msgs]) => ({
        id: userId,
        name: `用户 ${userId.substring(0, 6)}`,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
        messages: msgs,
      }));

      setConversations(convList);
      setLoading(false);

      // 订阅实时消息更新（依赖 Supabase Realtime，不再手动追加本地数据）
      subscription = supabaseBrowser
        .channel(`messages:user:${data.user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
          },
          (payload: any) => {
            const newMsg = payload.new;

            // 只处理与当前用户相关的消息
            if (
              newMsg.sender_id !== data.user.id &&
              newMsg.recipient_id !== data.user.id
            ) {
              return;
            }

            const otherId = newMsg.sender_id === data.user.id ? newMsg.recipient_id : newMsg.sender_id;

            setConversations((prevConvs) => {
              const updatedConvs = prevConvs.map((conv) => {
                if (conv.id === otherId) {
                  return {
                    ...conv,
                    messages: [...conv.messages, newMsg],
                  };
                }
                return conv;
              });

              // 如果不存在该对话，创建新的
              if (!updatedConvs.find((c) => c.id === otherId)) {
                updatedConvs.push({
                  id: otherId,
                  name: `用户 ${otherId.substring(0, 6)}`,
                  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
                  messages: [newMsg],
                });
              }

              return updatedConvs;
            });
          }
        )
        .subscribe();
    };

    init();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !selectedConversation) return;

    try {
      const { error } = await supabaseBrowser
        .from('messages')
        .insert([
          {
            sender_id: currentUserId,
            recipient_id: selectedId,
            text: inputMessage,
            created_at: new Date().toISOString(),
          }
        ]);

      if (error) {
        console.error('发送失败:', error);
        return;
      }

      setInputMessage('');
    } catch (err) {
      console.error('错误:', err);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        加载中...
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <h1 className="text-xl font-bold text-gray-900">消息</h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden max-w-md mx-auto w-full">
        {/* 对话列表 */}
        <div
          className={`${
            selectedId ? 'hidden' : 'w-full'
          } bg-white border-r border-gray-200 overflow-y-auto`}
        >
          {conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>暂无消息</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {conversations.map((conversation) => {
                const lastMsg = conversation.messages[conversation.messages.length - 1];
                return (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedId(conversation.id)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={conversation.avatar}
                        alt={conversation.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {lastMsg?.text || '没有消息'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 聊天界面 */}
        {selectedConversation && (
          <div className="w-full flex flex-col bg-white">
            {/* 聊天头部 */}
            <div className="border-b border-gray-200 p-4 flex items-center justify-between">
              <button
                onClick={() => setSelectedId(null)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-center">
                  {selectedConversation.name}
                </p>
              </div>
              <div className="w-6" />
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message, idx) => {
                const isOwn = message.sender_id === currentUserId;
                return (
                  <div
                    key={idx}
                    className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`max-w-xs ${
                        isOwn
                          ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                          : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none'
                      } px-4 py-2`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? 'text-blue-100' : 'text-gray-500'
                        }`}
                      >
                        {new Date(message.created_at).toLocaleTimeString('zh-CN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 输入框 */}
            <div className="border-t border-gray-200 p-4 flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder="输入消息..."
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.837654326,3.0486314 1.15159189,3.99701575 L3.03521743,10.4380088 C3.03521743,10.5951061 3.03521743,10.7522035 3.50612381,10.7522035 L16.6915026,11.5376904 C16.6915026,11.5376904 17.1624089,11.5376904 17.1624089,12.0089825 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
