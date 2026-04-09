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
  } catch (err: unknown) {
    // X API エラーコードに応じたメッセージ
    let message = "エラーが発生しました";
    let code = 500;

    if (err && typeof err === "object") {
      const e = err as Record<string, unknown>;
      const status = (e.code as number) ?? (e.status as number) ?? 0;

      if (status === 401) {
        message = "認証エラー：APIキーまたはアクセストークンが無効です。Vercelの環境変数を確認してください。";
        code = 401;
      } else if (status === 402 || status === 403) {
        message = "権限エラー：アプリの投稿権限が「Read and Write」になっていません。X Developer Portalでアプリ設定を変更し、アクセストークンを再発行してください。";
        code = 403;
      } else if (status === 429) {
        message = "レート制限：しばらく時間をおいてから再試行してください。";
        code = 429;
      } else if (err instanceof Error) {
        message = err.message;
      }
    }

    return NextResponse.json({ error: message }, { status: code });
  }
}
