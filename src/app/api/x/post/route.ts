import { NextRequest, NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";

export async function POST(req: NextRequest) {
  try {
    const { creds, text } = await req.json();
    if (!creds.apiKey || !creds.accessToken) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 400 });
    }
    if (!text?.trim()) {
      return NextResponse.json({ error: "投稿内容が空です" }, { status: 400 });
    }

    const client = getXClient(creds);
    const tweet = await client.v2.tweet(text);

    return NextResponse.json({
      id: tweet.data.id,
      text: tweet.data.text,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
