// ========================================
// hooks/useChat.ts
// チャット状態管理フック
// ========================================

'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ========================================
// 型定義
// ========================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface Analysis {
  id: string;
  title: string;
  messages: Message[];
  mermaidCode: string | null;
  createdAt: number;
  updatedAt: number;
}

interface ChatState {
  currentAnalysis: Analysis | null;
  isLoading: boolean;
  error: string | null;
}

interface ChatRequest {
  messages: Message[];
  shouldGenerateTree: boolean;
}

interface ChatResponse {
  message: Message;
  mermaidCode?: string;
}

// ========================================
// useChat Hook
// ========================================

export function useChat() {
  const [state, setState] = useState<ChatState>({
    currentAnalysis: null,
    isLoading: false,
    error: null,
  });

  // ========================================
  // 新規分析セッション開始
  // ========================================
  const startNewAnalysis = useCallback((firstMessage: string) => {
    const newAnalysis: Analysis = {
      id: uuidv4(),
      title: firstMessage,
      messages: [],
      mermaidCode: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setState({
      currentAnalysis: newAnalysis,
      isLoading: false,
      error: null,
    });
  }, []);

  // ========================================
  // メッセージ送信
  // ========================================
  const sendMessage = useCallback(
    async (content: string) => {
      // 入力検証
      if (!content.trim()) {
        setState((prev) => ({
          ...prev,
          error: 'メッセージを入力してください',
        }));
        return;
      }

      // 新規セッションの場合、初期化
      if (!state.currentAnalysis) {
        startNewAnalysis(content);
      }

      // ユーザーメッセージを追加
      const userMessage: Message = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        currentAnalysis: prev.currentAnalysis
          ? {
              ...prev.currentAnalysis,
              messages: [...prev.currentAnalysis.messages, userMessage],
              updatedAt: Date.now(),
            }
          : {
              id: uuidv4(),
              title: content,
              messages: [userMessage],
              mermaidCode: null,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
        isLoading: true,
        error: null,
      }));

      try {
        // API呼び出し
        const requestBody: ChatRequest = {
          messages: state.currentAnalysis
            ? [...state.currentAnalysis.messages, userMessage]
            : [userMessage],
          shouldGenerateTree: false,
        };

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'APIエラーが発生しました');
        }

        const data: ChatResponse = await response.json();

        // AI応答を追加
        setState((prev) => ({
          ...prev,
          currentAnalysis: prev.currentAnalysis
            ? {
                ...prev.currentAnalysis,
                messages: [...prev.currentAnalysis.messages, data.message],
                updatedAt: Date.now(),
              }
            : null,
          isLoading: false,
        }));
      } catch (error) {
        console.error('Send message error:', error);
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : '不明なエラーが発生しました',
        }));
      }
    },
    [state.currentAnalysis, startNewAnalysis]
  );

  // ========================================
  // ツリー生成
  // ========================================
  const generateTree = useCallback(async () => {
    if (!state.currentAnalysis || state.currentAnalysis.messages.length < 2) {
      setState((prev) => ({
        ...prev,
        error: '対話が不十分です。もう少しAIと対話してください。',
      }));
      return null;
    }

    setState((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      // API呼び出し(ツリー生成モード)
      const requestBody: ChatRequest = {
        messages: state.currentAnalysis.messages,
        shouldGenerateTree: true,
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'ツリー生成に失敗しました');
      }

      const data: ChatResponse = await response.json();

      // Mermaidコードを保存
      const updatedAnalysis: Analysis = {
        ...state.currentAnalysis,
        mermaidCode: data.mermaidCode || null,
        updatedAt: Date.now(),
      };

      setState((prev) => ({
        ...prev,
        currentAnalysis: updatedAnalysis,
        isLoading: false,
      }));

      return updatedAnalysis;
    } catch (error) {
      console.error('Generate tree error:', error);
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'ツリー生成に失敗しました',
      }));
      return null;
    }
  }, [state.currentAnalysis]);

  // ========================================
  // エラークリア
  // ========================================
  const clearError = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // ========================================
  // セッションリセット
  // ========================================
  const resetSession = useCallback(() => {
    setState({
      currentAnalysis: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    currentAnalysis: state.currentAnalysis,
    messages: state.currentAnalysis?.messages ?? [],
    isLoading: state.isLoading,
    error: state.error,
    sendMessage,
    generateTree,
    clearError,
    resetSession,
  };
}