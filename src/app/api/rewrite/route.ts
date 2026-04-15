import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

const GOAL_LABELS: Record<string, string> = {
  viral:    "バズらせる（フック強化・拡散されやすい表現に）",
  concise:  "簡潔にする（不要な言葉を削り、テンポよく）",
  engaging: "エンゲージメント強化（共感・コメントを促す）",
  formal:   "フォーマルに（丁寧で信頼感のある文体に）",
  casual:   "カジュアルに（親しみやすい口語体に）",
  hook:     "書き出し強化（1文目でぐっと引きつける）",
};

export async function POST(req: NextRequest) {
  const { original, goal } = await req.json();

  if (!original?.trim()) {
    return NextResponse.json({ error: "元の投稿が空です" }, { status: 422 });
  }
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY が設定されていません" }, { status: 500 });
  }

  const goalLabel = GOAL_LABELS[goal] ?? "バズらせる";
  const seed = Math.random().toString(36).slice(2, 8);

  const prompt = `
あなたはX投稿専門のリライターです。
以下の投稿を「${goalLabel}」という目的でリライトしてください。

【元の投稿】
${original}

【リライト方針】
- 元の内容・意図は保ちつつ、表現を大きく改善する
- 目的（${goalLabel}）を最優先で反映する
- ハッシュタグ禁止
- AIっぽい説明口調を避ける
- 人間が自然にXに投稿する文体にする
- 改行・テンポを意識する
- シード: ${seed}

【出力】
リライト後の投稿文のみを出力してください。説明や前置きは不要です。
`.trim();

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1024,
      temperature: 1.0,
    });
    const rewritten = completion.choices[0]?.message?.content?.trim() ?? "";
    return NextResponse.json({ rewritten });
  } catch (err) {
    const message = err instanceof Error ? err.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
