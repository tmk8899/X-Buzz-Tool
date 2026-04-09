import { NextRequest, NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";

export async function POST(req: NextRequest) {
  try {
    const creds = await req.json();
    if (!creds.apiKey || !creds.accessToken) {
      return NextResponse.json({ error: "APIキーが設定されていません" }, { status: 400 });
    }

    const client = getXClient(creds);
    const me = await client.v2.me({
      "user.fields": ["public_metrics", "profile_image_url", "description"],
    });

    return NextResponse.json({
      id: me.data.id,
      name: me.data.name,
      username: me.data.username,
      profileImageUrl: me.data.profile_image_url,
      description: me.data.description,
      followers: me.data.public_metrics?.followers_count ?? 0,
      following: me.data.public_metrics?.following_count ?? 0,
      tweetCount: me.data.public_metrics?.tweet_count ?? 0,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "エラーが発生しました";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
