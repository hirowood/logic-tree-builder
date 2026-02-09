# 🌳 なぜなぜ分析ツリー生成くん (Logic Tree Builder)

> AIとの対話を通じて、悩みの根本原因を可視化するWebアプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-15+-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 📖 プロジェクト概要

ユーザーが抱える「悩み」や「トラブル」を入力すると、AIがカウンセラーのように対話形式で「なぜ?(Why)」を深堀りし、最終的にその思考プロセスを**Mermaid.js**で可視化するアプリケーションです。

### 🎯 コンセプト

- **段階的思考**: AIが1つずつ問いかけ、思考を段階的に深掘り
- **逆算思考**: 最終ゴール(原因の特定)から逆算した対話フロー
- **ツリー構造**: 因果関係を階層的に可視化
- **MECE原則**: 漏れ・重複のない思考整理

---

## ✨ 主な機能

### 1. AI対話機能
- ✅ ユーザーの悩み入力
- ✅ AIによる「なぜ?」の問いかけ(1問ずつ)
- ✅ 対話の深掘り(目安3〜5層)

### 2. ツリー生成機能
- ✅ 対話履歴からMermaid記法生成
- ✅ Mermaidダイアグラム表示
- ✅ リアルタイムプレビュー

### 3. 履歴管理機能
- ✅ localStorageへの保存
- ✅ 過去の分析履歴の閲覧
- ✅ 履歴の削除

### 4. UI/UX
- ✅ チャット画面(左側)
- ✅ ツリー表示エリア(右側)
- ✅ レスポンシブデザイン

---

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| **Framework** | Next.js 15+ (App Router) |
| **Language** | TypeScript (strict: true) |
| **UI** | Tailwind CSS, Lucide React |
| **AI SDK** | @google/generative-ai |
| **Visualization** | mermaid |
| **State Management** | React Hooks |
| **Storage** | localStorage |

---

## 📦 セットアップ

### 前提条件

- Node.js 18.0+ 
- npm / yarn / pnpm
- Gemini API Key

### 1. プロジェクト作成

```bash
# Next.jsプロジェクト作成
npx create-next-app@latest logic-tree-builder --typescript --tailwind --app

# ディレクトリ移動
cd logic-tree-builder
```

### 2. 依存関係のインストール

```bash
# 必要なパッケージをインストール
npm install @google/generative-ai lucide-react mermaid uuid
npm install -D @types/uuid
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、Gemini API Keyを設定:

```bash
GEMINI_API_KEY=your_api_key_here
```

**重要**: `.env.local` は `.gitignore` に含まれているため、Gitにコミットされません。

---

## 📂 ディレクトリ構造

```
logic-tree-builder/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Gemini API連携
│   ├── layout.tsx                 # ルートレイアウト
│   ├── page.tsx                   # メイン画面
│   └── globals.css                # グローバルスタイル
│
├── components/
│   ├── ChatArea.tsx               # チャット表示エリア
│   ├── ChatInput.tsx              # メッセージ入力欄
│   ├── TreeArea.tsx               # ツリー表示エリア
│   └── MermaidDiagram.tsx         # Mermaidレンダリング
│
├── hooks/
│   ├── useChat.ts                 # チャット状態管理
│   └── useStorage.ts              # localStorage管理
│
├── types/
│   └── index.ts                   # 型定義集約
│
├── .env.local                     # 環境変数(gitignore)
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

---

## 🚀 実装手順

### ステップ1: 型定義の作成

`types/index.ts` に全型定義を集約します。

### ステップ2: API Routeの実装

`app/api/chat/route.ts` で Gemini API連携を実装します。

**重要**: モデル名は `gemini-2.5-flash` を使用してください。

### ステップ3: Custom Hooksの実装

- `hooks/useChat.ts`: チャット状態管理
- `hooks/useStorage.ts`: localStorage管理

### ステップ4: UIコンポーネントの実装

- `components/ChatArea.tsx`: チャット表示
- `components/ChatInput.tsx`: メッセージ入力
- `components/TreeArea.tsx`: ツリー表示
- `components/MermaidDiagram.tsx`: Mermaid描画

### ステップ5: メイン画面の実装

`app/page.tsx` で全コンポーネントを統合します。

---

## 💻 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 型チェック
npm run type-check

# Lint実行
npm run lint

# ビルド
npm run build

# 本番サーバー起動
npm start
```

---

## 🔒 セキュリティ

### API Key管理

- ✅ `.env.local` に保存(Gitにコミットされない)
- ✅ クライアント側に露出しない
- ✅ API Routes内でのみアクセス可能

### エラーハンドリング

- ✅ API Key未設定時の明確なエラーメッセージ
- ✅ Gemini APIエラー時のユーザーフレンドリーなメッセージ
- ✅ Mermaidレンダリングエラーの適切な処理

---

## 📝 設計思想

このプロジェクトは以下の設計原則に基づいて構築されています:

### 1. MECE原則の徹底

すべての機能・コンポーネント・型定義において、漏れ・重複をなくす設計を徹底しています。

### 2. 責務分離

レイヤードアーキテクチャに基づき、Presentation層・Application層・Infrastructure層を明確に分離しています。

### 3. 型安全性

TypeScript `strict: true` を前提とし、`any` 型の使用を禁止しています。

### 4. エラーハンドリング

すべての外部連携・非同期処理において、適切なエラーハンドリングを実装しています。

---

## 🎨 UI/UX

### デザインコンセプト

- **シンプル**: 機能に集中できる最小限のUI
- **直感的**: 初めてでも迷わない操作性
- **視覚的**: Mermaidによる因果関係の可視化

### カラースキーム

| 要素 | カラー |
|------|--------|
| プライマリ | インディゴ(#4F46E5) |
| セカンダリ | ブルー(#2563EB) |
| 背景 | グレー(#F9FAFB) |
| エラー | レッド(#DC2626) |

---

## 📚 参考資料

- [Next.js 公式ドキュメント](https://nextjs.org/docs)
- [Google Generative AI SDK](https://ai.google.dev/docs)
- [Mermaid.js 公式ドキュメント](https://mermaid.js.org/)
- [Tailwind CSS 公式ドキュメント](https://tailwindcss.com/docs)

---

## 🤝 貢献

このプロジェクトはポートフォリオ作品ですが、フィードバックやIssueは大歓迎です。

---

## 📄 ライセンス

MIT License

---

## 👤 作成者

**池田裕樹**
- ポートフォリオ: [準備中]
- GitHub: [準備中]

---

## 📮 お問い合わせ

プロジェクトに関するご質問は、GitHubのIssueにてお願いします。

---

**Created with ❤️ by 池田裕樹 | 2025**