import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { buildGeneratePrompt } from "@/lib/prompts";
import type { GeneratePostInput, GeneratePostResponse, GeneratedPostResult } from "@/types/generate";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  // API キーが設定されていない場合はモックを返す
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.startsWith("sk-ant-xx")) {
    return NextResponse.json(getMockResponse(), { status: 200 });
  }

  let input: GeneratePostInput;
  try {
    input = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  if (!input.topic?.trim()) {
    return NextResponse.json({ error: "topic is required" }, { status: 422 });
  }

  try {
    const prompt = buildGeneratePrompt(input);

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const raw = message.content[0].type === "text" ? message.content[0].text : "";

    let results: GeneratedPostResult[];
    try {
      // Claude が ```json ... ``` で囲む場合があるので除去
      const jsonText = raw.replace(/^```(?:json)?\s*/m, "").replace(/\s*```$/m, "").trim();
      results = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw }, { status: 502 });
    }

    const response: GeneratePostResponse = {
      results,
      model: message.model,
      usage: {
        input_tokens: message.usage.input_tokens,
        output_tokens: message.usage.output_tokens,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// ----- モックレスポンス（APIキー未設定時）-----
function getMockResponse(): GeneratePostResponse {
  return {
    results: [
      {
        title: "月収2倍への最短ルート",
        hook: "フリーランス2年目で月収が2倍になった。\nやったことは、たった1つだけ。",
        body: "それは「発信すること」でした。\n\nスキルは変わっていない。\n時間も変わっていない。\n\nでも「この人に頼みたい」と思われた瞬間、\n仕事は向こうからやってくる。\n\n✅ 週3回のアウトプット\n✅ 実績の言語化\n✅ 失敗談も正直に話す\n\nこれだけで半年後の世界が変わります。",
        cta: "あなたはまだ発信していませんか？\nコメントで教えてください👇",
        hashtags: ["副業", "フリーランス", "エンジニア"],
        full_post:
          "フリーランス2年目で月収が2倍になった。\nやったことは、たった1つだけ。\n\nそは「発信すること」でした。\n\nスキルは変わっていない。\n時間も変わっていない。\n\nでも「この人に頼みたい」と思われた瞬間、\n仕事は向こうからやってくる。\n\nあなたはまだ発信していませんか？\nコメントで教えてください👇",
      },
      {
        title: "副業エンジニアの収益UP3ステップ",
        hook: "【実証済み】副業月収10万を達成した3つのステップ",
        body: "Step1: スキルの棚卸し\n→ 今できることを全部リストアップ\n\nStep2: 発信で実績を可視化\n→ 週3回SNSにアウトプット\n\nStep3: 紹介案件を増やす\n→ 既存クライアントから次を繋いでもらう\n\n大事なのは順番を守ること。\n最初からスキルアップに走ると遠回りになる。",
        cta: "どのステップが一番難しいですか？\nRTで意見を聞かせてください🔁",
        hashtags: ["副業", "エンジニア副業", "月収UP"],
        full_post:
          "【実証済み】副業月収10万を達成した3つのステップ\n\nStep1: スキルの棚卸し\nStep2: 発信で実績を可視化\nStep3: 紹介案件を増やす\n\nどのステップが一番難しいですか？\nRTで意見を聞かせてください🔁",
      },
      {
        title: "発信しない損失を計算してみた",
        hook: "「まだ発信するほどのスキルがない」\nこれ、最も危険な思い込みです。",
        body: "発信しないエンジニアが年間に失う機会を計算してみた。\n\n・案件紹介: 年3件 × 50万 = 150万\n・認知によるUP交渉: +20万/年\n・コミュニティからの学び: プライスレス\n\n合計300万円以上のチャンスを\n「まだ早い」という思い込みで逃している。\n\n完璧じゃなくていい。\n今日の1ツイートが未来を変える。",
        cta: "今すぐ1つアウトプットしてみませんか？",
        hashtags: ["エンジニア", "キャリア", "発信力"],
        full_post:
          "「まだ発信するほどのスキルがない」\nこれ、最も危険な思い込みです。\n\n発信しないエンジニアが年間に失う機会を計算してみた。\n\n今すぐ1つアウトプットしてみませんか？",
      },
    ],
    model: "mock",
    usage: { input_tokens: 0, output_tokens: 0 },
  };
}
