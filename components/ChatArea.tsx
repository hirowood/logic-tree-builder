// ========================================
// components/ChatArea.tsx
// チャット表示エリアコンポーネント
// ========================================

'use client';

import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatAreaProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatArea({ messages, isLoading }: ChatAreaProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // ========================================
  // 自動スクロール(新しいメッセージが追加されたとき)
  // ========================================
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // ========================================
  // 初期表示
  // ========================================
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Bot className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            対話を開始しましょう
          </h3>
          <p className="text-sm text-gray-500">
            あなたの悩みや問題を入力してください。<br />
            AIが「なぜ?」を問いかけながら、思考を深掘りします。
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // メッセージ表示
  // ========================================
  return (
    <div
      ref={scrollRef}
      className="h-96 overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg"
    >
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 ${
            message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          {/* アイコン */}
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
            }`}
          >
            {message.role === 'user' ? (
              <User className="w-5 h-5" />
            ) : (
              <Bot className="w-5 h-5" />
            )}
          </div>

          {/* メッセージバブル */}
          <div
            className={`max-w-[70%] px-4 py-2 rounded-lg ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-800 border border-gray-200'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <p
              className={`text-xs mt-1 ${
                message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
              }`}
            >
              {new Date(message.timestamp).toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
      ))}

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}