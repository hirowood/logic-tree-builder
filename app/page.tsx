// ========================================
// app/page.tsx
// メイン画面
// ========================================

'use client';

import { useState } from 'react';
import ChatArea from '@/components/ChatArea';
import ChatInput from '@/components/ChatInput';
import TreeArea from '@/components/TreeArea';
import { useChat } from '@/hooks/useChat';
import { useStorage } from '@/hooks/useStorage';
import { AlertCircle, RefreshCw, Save } from 'lucide-react';

export default function Home() {
  const {
    currentAnalysis,
    messages,
    isLoading,
    error,
    sendMessage,
    generateTree,
    clearError,
    resetSession,
  } = useChat();

  const { saveAnalysis } = useStorage();
  const [isSaving, setIsSaving] = useState(false);

  // ========================================
  // メッセージ送信ハンドラ
  // ========================================
  const handleSendMessage = async (content: string) => {
    await sendMessage(content);
  };

  // ========================================
  // ツリー生成ハンドラ
  // ========================================
  const handleGenerateTree = async () => {
    const analysis = await generateTree();
    if (analysis && analysis.mermaidCode) {
      // 自動保存
      setIsSaving(true);
      saveAnalysis(analysis);
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  // ========================================
  // 新規セッション開始
  // ========================================
  const handleNewSession = () => {
    if (window.confirm('現在の分析をリセットして、新しい分析を開始しますか?')) {
      resetSession();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            🌳 なぜなぜ分析ツリー生成くん
          </h1>

          {/* 新規セッションボタン */}
          {messages.length > 0 && (
            <button
              onClick={handleNewSession}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              新規分析
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* エラー表示 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800 font-semibold mb-1">エラーが発生しました</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              閉じる
            </button>
          </div>
        )}

        {/* 2カラムレイアウト */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左側: チャットエリア */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              💬 対話エリア
            </h2>
            <ChatArea messages={messages} isLoading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </div>

          {/* 右側: ツリー表示エリア */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                🌲 思考ツリー
              </h2>
              {isSaving && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Save className="w-4 h-4" />
                  <span>保存しました</span>
                </div>
              )}
            </div>

            <TreeArea mermaidCode={currentAnalysis?.mermaidCode ?? null} />

            {/* ツリー生成ボタン */}
            <button
              onClick={handleGenerateTree}
              disabled={isLoading || messages.length < 4 || !!currentAnalysis?.mermaidCode}
              className="mt-4 w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold flex items-center justify-center gap-2"
            >
              {currentAnalysis?.mermaidCode ? (
                <>✅ ツリー生成済み</>
              ) : (
                <>🎯 分析を終了してツリーを作る</>
              )}
            </button>

            {messages.length > 0 && messages.length < 4 && !currentAnalysis?.mermaidCode && (
              <p className="mt-2 text-xs text-gray-500 text-center">
                もう少し対話を重ねてから、ツリーを生成してください(目安: 4回以上の対話)
              </p>
            )}
          </div>
        </div>

        {/* 使い方ガイド */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">📖 使い方</h2>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start gap-2">
              <span className="font-semibold text-indigo-600">1.</span>
              <p>あなたの悩みや問題を入力してください</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-indigo-600">2.</span>
              <p>AIが「なぜ?」と問いかけてきますので、思いつくままに答えてください</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-indigo-600">3.</span>
              <p>3〜5回ほど対話を重ね、十分に深掘りできたら「ツリーを作る」ボタンを押してください</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-semibold text-indigo-600">4.</span>
              <p>思考プロセスがツリー形式で可視化されます。因果関係を確認してみましょう!</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-6 text-center text-sm text-gray-600">
        <p>© 2025 Logic Tree Builder | Created by 池田裕樹 | Portfolio Project</p>
      </footer>
    </div>
  );
}