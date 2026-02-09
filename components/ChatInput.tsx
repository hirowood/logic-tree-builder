// ========================================
// components/ChatInput.tsx
// メッセージ入力コンポーネント
// ========================================

'use client';

import { useState, KeyboardEvent } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  // ========================================
  // メッセージ送信処理
  // ========================================
  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    onSendMessage(input.trim());
    setInput(''); // 入力欄をクリア
  };

  // ========================================
  // Enterキーで送信(Shift+Enterで改行)
  // ========================================
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="mt-4 flex gap-2">
      {/* テキストエリア */}
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="あなたの悩みや問題を入力してください..."
        disabled={isLoading}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        rows={3}
      />

      {/* 送信ボタン */}
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
      >
        <Send className="w-5 h-5" />
        送信
      </button>
    </div>
  );
}