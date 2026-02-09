// ========================================
// components/MermaidDiagram.tsx
// Mermaidダイアグラム描画コンポーネント
// ========================================

'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  /** レンダリングするMermaidコード */
  code: string;
  /** エラー発生時のコールバック(オプション) */
  onError?: (error: Error) => void;
}

export default function MermaidDiagram({ code, onError }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInitializedRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // ========================================
  // Mermaid初期化とダイアグラムレンダリング
  // ========================================
  useEffect(() => {
    if (!code) {
      return;
    }

    // 初回のみmermaid初期化
    if (!isInitializedRef.current) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'sans-serif',
      });
      isInitializedRef.current = true;
    }

    const renderDiagram = async () => {
      try {
        // 既存のコンテンツをクリア
        if (ref.current) {
          ref.current.innerHTML = '';
        }

        // 一意のIDを生成(再レンダリング対応)
        const id = `mermaid-diagram-${Date.now()}`;

        // Mermaidコードをレンダリング
        const { svg } = await mermaid.render(id, code);

        // SVGをDOMに挿入
        if (ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        console.error('Mermaid rendering error:', err);

        const errorMessage =
          err instanceof Error
            ? err.message
            : 'ダイアグラムの描画中に不明なエラーが発生しました';

        setError(errorMessage);

        // エラーコールバックを呼び出し
        if (onError && err instanceof Error) {
          onError(err);
        }
      }
    };

    renderDiagram();
  }, [code, onError]);

  // ========================================
  // エラー表示
  // ========================================
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg
            className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-red-800 mb-1">
              ツリーの描画に失敗しました
            </h3>
            <p className="text-sm text-red-600">{error}</p>
            <p className="text-xs text-red-500 mt-2">
              Mermaidコードの構文を確認してください。
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ========================================
  // ローディング表示
  // ========================================
  if (!code) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <p className="text-gray-500 text-sm">
          まだツリーが生成されていません。<br />
          対話を開始して「分析を終了してツリーを作る」ボタンを押してください。
        </p>
      </div>
    );
  }

  // ========================================
  // ダイアグラム表示
  // ========================================
  return (
    <div className="mermaid-container">
      <div
        ref={ref}
        className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200"
        style={{
          minHeight: '400px',
          overflow: 'auto',
        }}
      />
    </div>
  );
}