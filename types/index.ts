// ========================================
// types/index.ts
// なぜなぜ分析ツリー生成くん - 型定義集約ファイル
// ========================================

// ========================================
// Message関連
// ========================================

/**
 * チャットメッセージの型定義
 */
export interface Message {
  /** 一意のID(UUID) */
  id: string;
  /** メッセージの送信者 */
  role: 'user' | 'assistant';
  /** メッセージ内容 */
  content: string;
  /** タイムスタンプ(Unix time) */
  timestamp: number;
}

// ========================================
// Analysis関連
// ========================================

/**
 * 分析セッションの型定義
 */
export interface Analysis {
  /** 一意のID(UUID) */
  id: string;
  /** 分析タイトル(最初の悩み) */
  title: string;
  /** 対話履歴 */
  messages: Message[];
  /** 生成されたMermaidコード */
  mermaidCode: string | null;
  /** 作成日時(Unix time) */
  createdAt: number;
  /** 更新日時(Unix time) */
  updatedAt: number;
}

// ========================================
// State関連
// ========================================

/**
 * チャット画面の状態管理
 */
export interface ChatState {
  /** 現在の分析セッション */
  currentAnalysis: Analysis | null;
  /** AI応答待機中フラグ */
  isLoading: boolean;
  /** エラーメッセージ */
  error: string | null;
}

// ========================================
// API関連
// ========================================

/**
 * チャットAPIリクエストの型定義
 */
export interface ChatRequest {
  /** 現在までの対話履歴 */
  messages: Message[];
  /** ツリー生成を要求するか */
  shouldGenerateTree: boolean;
}

/**
 * チャットAPIレスポンスの型定義
 */
export interface ChatResponse {
  /** AIの応答メッセージ */
  message: Message;
  /** ツリー生成時のみ返却されるMermaidコード */
  mermaidCode?: string;
}

/**
 * APIエラーレスポンスの型定義
 */
export interface ErrorResponse {
  /** エラーメッセージ */
  error: string;
  /** エラーコード */
  code: 'API_KEY_MISSING' | 'GEMINI_API_ERROR' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
}

// ========================================
// Props関連
// ========================================

/**
 * ChatAreaコンポーネントのProps
 */
export interface ChatAreaProps {
  /** 表示するメッセージ一覧 */
  messages: Message[];
  /** ローディング状態 */
  isLoading: boolean;
}

/**
 * ChatInputコンポーネントのProps
 */
export interface ChatInputProps {
  /** メッセージ送信時のコールバック */
  onSendMessage: (content: string) => void;
  /** ローディング状態(送信ボタンの無効化に使用) */
  isLoading: boolean;
}

/**
 * TreeAreaコンポーネントのProps
 */
export interface TreeAreaProps {
  /** 表示するMermaidコード */
  mermaidCode: string | null;
}

/**
 * MermaidDiagramコンポーネントのProps
 */
export interface MermaidDiagramProps {
  /** レンダリングするMermaidコード */
  code: string;
  /** エラー発生時のコールバック(オプション) */
  onError?: (error: Error) => void;
}

// ========================================
// Utility Types
// ========================================

/**
 * メッセージ送信関数の型
 */
export type SendMessageFunction = (content: string) => Promise<void>;

/**
 * ツリー生成関数の型
 */
export type GenerateTreeFunction = () => Promise<Analysis | null>;