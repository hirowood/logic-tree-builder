// ========================================
// hooks/useStorage.ts
// localStorage管理フック
// ========================================

'use client';

import { useState, useCallback } from 'react';

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

// ========================================
// 定数
// ========================================

const STORAGE_KEY = 'logic-tree-analyses';

// ========================================
// useStorage Hook
// ========================================

export function useStorage() {
  // ========================================
  // localStorageから読み込み(初期化関数を使用)
  // ========================================
  const [analyses, setAnalyses] = useState<Analysis[]>(() => {
    try {
      // クライアントサイドでのみ実行
      if (typeof window === 'undefined') {
        return [];
      }

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: Analysis[] = JSON.parse(stored);
        // 日付順にソート(新しい順)
        return parsed.sort((a, b) => b.updatedAt - a.updatedAt);
      }
      return [];
    } catch (err) {
      console.error('Failed to load analyses from localStorage:', err);
      return [];
    }
  });

  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // 分析を保存
  // ========================================
  const saveAnalysis = useCallback(
    (analysis: Analysis) => {
      try {
        // 既存の分析を更新または新規追加
        const existingIndex = analyses.findIndex((a) => a.id === analysis.id);

        let updated: Analysis[];
        if (existingIndex >= 0) {
          // 更新
          updated = [...analyses];
          updated[existingIndex] = analysis;
        } else {
          // 新規追加
          updated = [analysis, ...analyses];
        }

        // 日付順にソート(新しい順)
        updated.sort((a, b) => b.updatedAt - a.updatedAt);

        setAnalyses(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setError(null);
      } catch (err) {
        console.error('Failed to save analysis:', err);
        setError('分析の保存に失敗しました');
      }
    },
    [analyses]
  );

  // ========================================
  // 分析を削除
  // ========================================
  const deleteAnalysis = useCallback(
    (id: string) => {
      try {
        const updated = analyses.filter((a) => a.id !== id);
        setAnalyses(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setError(null);
      } catch (err) {
        console.error('Failed to delete analysis:', err);
        setError('分析の削除に失敗しました');
      }
    },
    [analyses]
  );

  // ========================================
  // 全削除
  // ========================================
  const clearAll = useCallback(() => {
    try {
      setAnalyses([]);
      localStorage.removeItem(STORAGE_KEY);
      setError(null);
    } catch (err) {
      console.error('Failed to clear all analyses:', err);
      setError('履歴のクリアに失敗しました');
    }
  }, []);

  // ========================================
  // IDで分析を取得
  // ========================================
  const getAnalysisById = useCallback(
    (id: string): Analysis | null => {
      return analyses.find((a) => a.id === id) || null;
    },
    [analyses]
  );

  return {
    analyses,
    isLoading,
    error,
    saveAnalysis,
    deleteAnalysis,
    clearAll,
    getAnalysisById,
  };
}