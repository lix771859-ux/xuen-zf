'use client';

import { useState } from 'react';

interface Message {
  id: number;
  sender: 'user' | 'landlord';
  text: string;
  timestamp: string;
  avatar: string;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  messages: Message[];
}

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: '房东 - 张先生',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    lastMessage: '好的，我们周末见面看房',
    unread: 2,
    messages: [
      {
        id: 1,
        sender: 'landlord',
        text: '你好，有什么可以帮助你的吗？',
        timestamp: '10:30',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
      {
        id: 2,
        sender: 'user',
        text: '你好，我想了解一下这个房子的租赁情况',
        timestamp: '10:35',
        avatar: 'https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=100&h=100&fit=crop',
      },
      {
        id: 3,
        sender: 'landlord',
        text: '好的，我们可以周末看房',
        timestamp: '10:40',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
      },
    ],
  },
  {
    id: 2,
    name: '房东 - 李女士',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    lastMessage: '房子已经租出去了',
    unread: 0,
    messages: [
      {
        id: 1,
        sender: 'landlord',
        text: '房子已经租出去了，感谢你的咨询',
        timestamp: '昨天',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
      },
    ],
  },
];

export default function Messages() {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [inputMessage, setInputMessage] = useState('');

  const selectedConversation = conversations.find((c) => c.id === selectedId);

  const handleSendMessage = () => {
    if (!inputMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map((conv) => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          lastMessage: inputMessage,
          messages: [
            ...conv.messages,
            {
              id: conv.messages.length + 1,
              sender: 'user',
              text: inputMessage,
              timestamp: new Date().toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              avatar: 'https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=100&h=100&fit=crop',
            },
          ],
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setInputMessage('');
  };

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
              {conversations.map((conversation) => (
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
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.name}
                        </p>
                        {conversation.unread > 0 && (
                          <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                            {conversation.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
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
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
              </button>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <img
                    src={message.avatar}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div
                    className={`max-w-xs ${
                      message.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                        : 'bg-gray-100 text-gray-900 rounded-2xl rounded-tl-none'
                    } px-4 py-2`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.sender === 'user'
                          ? 'text-blue-100'
                          : 'text-gray-500'
                      }`}
                    >
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
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
