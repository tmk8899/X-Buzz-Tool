import { NextRequest, NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";

export async function POST(req: NextRequest) {
  try {
    const { creds, userId } = await req.json();
    if (!creds.apiKey || !creds.accessToken) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 400 });
    }

    const client = getXClient(creds);
    const tweets = await client.v2.userTimeline(userId, {
      max_results: 20,
      "tweet.fields": ["created_at", "public_metrics", "text"],
      exclude: ["retweets", "replies"],
    });

    const results = tweets.data.data?.map((t) => ({
      id: t.id,
      content: t.text,
      createdAt: t.created_at,
      likes: t.public_metrics?.like_count ?? 0,
      retweets: t.public_metrics?.retweet_count ?? 0,
      replies: t.public_metrics?.reply_count ?? 0,
      impressions: t.public_metrics?.impression_count ?? 0,
    })) ?? [];

    return NextResponse.json(results);
  } catch (err) {
    const message = err instanceof Error ? err.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
