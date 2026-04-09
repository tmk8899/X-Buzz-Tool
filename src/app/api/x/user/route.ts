import { NextResponse } from "next/server";
import { getXClient } from "@/lib/x-client";

export async function GET() {
  try {
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
