// ========================================
// components/TreeArea.tsx
// ツリー表示エリアコンポーネント
// ========================================

'use client';

import MermaidDiagram from './MermaidDiagram';
import { Network } from 'lucide-react';

interface TreeAreaProps {
  mermaidCode: string | null;
}

export default function TreeArea({ mermaidCode }: TreeAreaProps) {
  // ========================================
  // 初期表示(ツリー未生成)
  // ========================================
  if (!mermaidCode) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <Network className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            思考ツリーを作成しましょう
          </h3>
          <p className="text-sm text-gray-500">
            AIと対話を重ね、十分に深掘りできたら<br />
            「分析を終了してツリーを作る」ボタンを押してください。
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ツリー表示
  // ========================================
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Network className="w-4 h-4" />
        <span>なぜなぜ分析ツリー</span>
      </div>

      <MermaidDiagram code={mermaidCode} />

      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="font-semibold mb-1">📝 ツリーの見方</p>
        <ul className="space-y-1 list-disc list-inside">
          <li>一番上が「あなたの悩み」です</li>
          <li>矢印の先が「原因」を表しています</li>
          <li>下に行くほど、根本的な原因に近づきます</li>
        </ul>
      </div>
    </div>
  );
}