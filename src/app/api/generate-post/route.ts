import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GeneratePostInput, GeneratePostResponse, GeneratedPostResult } from "@/types/generate";

function isValidApiKey(key: string | undefined): boolean {
  return !!key && key.length > 20;
}

export async function POST(req: NextRequest) {
  let input: GeneratePostInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!input.topic?.trim()) {
    return NextResponse.json({ error: "topic is required" }, { status: 422 });
  }

  if (!isValidApiKey(process.env.GROQ_API_KEY)) {
    return NextResponse.json(
      { error: "GROQ_API_KEY が設定されていません。Vercelの環境変数を確認してください。" },
      { status: 500 }
    );
  }

  const selectedPatterns = pickRandomItems(patternPool, 3);

  // 毎回違う結果を出すためのランダムシード
  const randomSeed = Math.random().toString(36).slice(2, 8);
  const timeStamp = new Date().toLocaleString("ja-JP");

  try {
    const prompt = `
あなたはX投稿専用のSNSコピーライターです。
CTR・保存率・引用率が高い、完全オリジナルの日本語投稿を3案生成してください。

【生成ID: ${randomSeed} / ${timeStamp}】
※ 毎回必ず異なる切り口・表現・構成にすること。過去の出力と被らないようにすること。

【テーマ】
${input.topic}

【ターゲット】
${input.target}

【目的】
${input.purpose}

【バズ投稿の型】
${input.tone}

【文字数目安】
${input.maxChars}文字前後

【投稿パターン（3案それぞれ異なる型を使うこと）】
${selectedPatterns.join(" / ")}

【ペルソナ（最重要・必ずこの人物として書くこと）】
${input.persona
  ? `名前: ${input.persona.name}\nトーン・スタイル: ${input.persona.tone || "指定なし"}\n→ 上記のトーン・スタイルを最優先で文体・口調に反映させること`
  : "指定なし"}

【追加指示】
${input.customInstruction || "なし"}

【絶対ルール】
- 3案は必ず互いに全く異なる内容・切り口・文体にすること
- 同じ出だし・同じ展開は禁止
- テンプレート的な表現は使わない
- ハッシュタグ禁止
- AIっぽい説明口調を避ける
- 1文目で強く引きつける（12〜22文字程度）
- 常識を少し壊すか、不安・違和感・意外性を入れる
- 人間が実際にXへ投稿する文体にする
- 説明しすぎず余白を残す
- 短文中心で改行を自然に入れる
- ペルソナのトーンが絵文字使用を示している場合のみ絵文字を使ってよい

【出力形式】
以下のJSON配列のみを出力すること。コードブロックや説明文は不要。

[
  {
    "title": "投稿タイトル（内部管理用）",
    "hook": "フック文（冒頭1〜2文）",
    "body": "本文",
    "cta": "CTA文（不要なら空文字）",
    "hashtags": [],
    "full_post": "hook + body + ctaを自然につなげた完成形の投稿文"
  },
  { ... },
  { ... }
]
`.trim();

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
      temperature: 1.1,   // 高めに設定して毎回異なる出力を保証
      top_p: 0.95,
    });
    const raw = completion.choices[0]?.message?.content ?? "";

    let results: GeneratedPostResult[];
    try {
      const jsonText = raw.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();
      results = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "AI応答の解析に失敗しました", raw }, { status: 502 });
    }

    const response: GeneratePostResponse = {
      results,
      model: "llama-3.3-70b-versatile",
      usage: { input_tokens: 0, output_tokens: 0 },
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

const patternPool = [
  "共感型",
  "逆張り型",
  "アルゴリズム型",
  "データ型",
  "失敗談型",
  "比較型",
  "暴露型",
  "ストーリー型",
  "チェックリスト型",
  "結論先出し型",
  "問いかけ型",
  "体験告白型",
  "数字インパクト型",
  "常識破壊型",
];

function pickRandomItems<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const result: T[] = [];
  while (copy.length && result.length < count) {
    const index = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(index, 1)[0]);
  }
  return result;
}
