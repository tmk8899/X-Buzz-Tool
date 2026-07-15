import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import type { GeneratePostInput, GeneratePostResponse, GeneratedPostResult } from "@/types/generate";
import { buildGeneratePostPrompt } from "@/lib/prompts";

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

  try {
    const prompt = buildGeneratePostPrompt(input);

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
