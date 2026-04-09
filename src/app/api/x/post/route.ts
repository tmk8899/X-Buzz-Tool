import { NextRequest, NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    const creds = {
      apiKey: process.env.X_API_KEY ?? "",
      apiSecret: process.env.X_API_SECRET ?? "",
      accessToken: process.env.X_ACCESS_TOKEN ?? "",
      accessTokenSecret: process.env.X_ACCESS_TOKEN_SECRET ?? "",
      bearerToken: process.env.X_BEARER_TOKEN ?? "",
    };

    if (!creds.apiKey || !creds.accessToken) {
      return NextResponse.json({ error: "X APIキーが設定されていません" }, { status: 400 });
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
