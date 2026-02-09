// ========================================
// app/api/chat/route.ts
// Gemini API連携エンドポイント
// ========================================

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

// 型定義のインポート
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChatRequest {
  messages: Message[];
  shouldGenerateTree: boolean;
}

interface ChatResponse {
  message: Message;
  mermaidCode?: string;
}

interface ErrorResponse {
  error: string;
  code: 'API_KEY_MISSING' | 'GEMINI_API_ERROR' | 'INVALID_REQUEST' | 'UNKNOWN_ERROR';
}

// ========================================
// System Instruction(AIの役割定義)
// ========================================

const SYSTEM_INSTRUCTION = `# あなたの役割

あなたは「優しく論理的な思考整理カウンセラー」です。

## 対話の原則

1. **1回につき1つの質問のみ**
   - 複数の質問を同時にしない
   - ユーザーが答えやすい形で問いかける

2. **段階的な深掘り**
   - いきなり解決策を提示しない
   - 「それはなぜだと思いますか?」と優しく問いかける
   - ユーザーが「原因」を答えたら、さらにその「原因の原因」を聞く

3. **目安の深さ**
   - 3〜5層の深掘りを目標とする
   - ユーザーが「これ以上は分からない」と感じたら、それ以上は掘り下げない

4. **終了判定**
   - ユーザーが「分析を終了したい」と伝えたら、対話を終了する
   - 十分に深掘りできたと判断したら、Mermaidコード生成の提案をする

## 注意事項

- ユーザーの悩みを否定しない
- 共感を示しつつ、論理的に掘り下げる
- 専門用語を避け、平易な言葉で問いかける
- 必ず1つの質問だけをする
`;

// ========================================
// Mermaidツリー生成用のSystem Instruction
// ========================================

const MERMAID_GENERATION_INSTRUCTION = `これまでの対話を分析し、因果関係をMermaid記法で可視化してください。

## 出力形式

以下のJSON形式で、Mermaidコードを出力してください:

\`\`\`json
{
  "mermaidCode": "graph TD;\\n  A[悩み] --> B[原因1];\\n  B --> C[原因2];\\n  C --> D[原因3];"
}
\`\`\`

## Mermaidコードの要件

1. **graph TD;** 形式を使用(Top-Down形式)
2. ノードIDは **A, B, C, D...** のように英字を使用
3. ノードラベルは **[ラベル]** の形式
4. 矢印は **-->** を使用
5. 改行は **\\n** で表現

## 構造化の原則

- 最上位に「ユーザーの最初の悩み」を配置
- 因果関係を階層的に表現
- 各ノードは簡潔に(20文字以内推奨)
- 複雑すぎる構造は避ける(最大5層程度)

必ずJSON形式のみを返してください。他のテキストは含めないでください。
`;

// ========================================
// POST /api/chat
// ========================================

export async function POST(req: NextRequest) {
  try {
    // ========================================
    // 1. API Key確認
    // ========================================
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      return NextResponse.json<ErrorResponse>(
        {
          error: 'API Keyが設定されていません。.env.localファイルを確認してください。',
          code: 'API_KEY_MISSING',
        },
        { status: 400 }
      );
    }

    // ========================================
    // 2. リクエストボディのパース
    // ========================================
    let body: ChatRequest;
    try {
      body = await req.json();
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json<ErrorResponse>(
        {
          error: 'リクエストの形式が正しくありません。',
          code: 'INVALID_REQUEST',
        },
        { status: 400 }
      );
    }

    const { messages, shouldGenerateTree } = body;

    // ========================================
    // 3. Gemini API Client初期化
    // ========================================
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash', // 固定(重要!)
      systemInstruction: shouldGenerateTree ? MERMAID_GENERATION_INSTRUCTION : SYSTEM_INSTRUCTION,
    });

    // ========================================
    // 4. 対話履歴をGemini形式に変換
    // ========================================
    const history = messages.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // ========================================
    // 5. チャットセッション開始
    // ========================================
    const chat = model.startChat({
      history: history.slice(0, -1), // 最後のメッセージ以外を履歴として渡す
    });

    // ========================================
    // 6. AIにメッセージ送信
    // ========================================
    const lastMessage = messages[messages.length - 1];
    const result = await chat.sendMessage(lastMessage.content);
    const response = await result.response;
    const responseText = response.text();

    // ========================================
    // 7. Mermaidコード生成判定
    // ========================================
    let mermaidCode: string | undefined;

    if (shouldGenerateTree) {
      try {
        // JSON形式のレスポンスをパース
        const jsonMatch = responseText.match(/\{[\s\S]*"mermaidCode"[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          mermaidCode = parsed.mermaidCode;
        }
      } catch (parseError) {
        console.error('Failed to parse Mermaid code from response:', parseError);
        // パースに失敗した場合はデフォルトのツリーを返す
        mermaidCode = `graph TD;\n  A[分析結果] --> B[Mermaidコードの生成に失敗しました];\n  B --> C[対話履歴を確認してください];`;
      }
    }

    // ========================================
    // 8. レスポンス構築
    // ========================================
    const assistantMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: shouldGenerateTree && mermaidCode
        ? 'なぜなぜ分析が完了しました。ツリーを確認してください。'
        : responseText,
      timestamp: Date.now(),
    };

    const chatResponse: ChatResponse = {
      message: assistantMessage,
      ...(mermaidCode && { mermaidCode }),
    };

    return NextResponse.json<ChatResponse>(chatResponse);

  } catch (error) {
    // ========================================
    // エラーハンドリング
    // ========================================
    console.error('Gemini API Error:', error);

    // エラーの詳細をログに出力(デバッグ用)
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }

    return NextResponse.json<ErrorResponse>(
      {
        error: 'AIとの通信に失敗しました。しばらく待ってから再度お試しください。',
        code: 'GEMINI_API_ERROR',
      },
      { status: 500 }
    );
  }
}