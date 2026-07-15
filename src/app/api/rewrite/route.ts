import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildRewritePrompt } from "@/lib/prompts";

export async function POST(req: NextRequest) {
  const { original, goal } = await req.json();

  if (!original?.trim()) {
    return NextResponse.json({ error: "元の投稿が空です" }, { status: 422 });
  }
  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY が設定されていません" }, { status: 500 });
  }

  const prompt = buildRewritePrompt(original, goal);

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
