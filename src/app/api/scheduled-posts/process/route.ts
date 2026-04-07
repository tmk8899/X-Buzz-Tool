import { NextResponse } from "next/server";
import { getDuePosts, markAsPublished, markAsFailed } from "@/lib/scheduled-posts-store";

/**
 * POST /api/scheduled-posts/process
 *
 * cron / 外部ジョブから定期呼び出しされることを想定したエンドポイント。
 * scheduledAt が現在以前で status === "scheduled" の投稿を処理する。
 *
 * 現在: ローカル実装（即座に "published" に変更）
 * 将来: X API (POST /2/tweets) を呼んで実投稿 → xPostId を保存
 *
 * cron 設定例 (Vercel Cron / GitHub Actions):
 *   curl -X POST https://your-domain.com/api/scheduled-posts/process \
 *        -H "Authorization: Bearer $CRON_SECRET"
 */
export async function POST() {
  const due = getDuePosts();

  if (due.length === 0) {
    return NextResponse.json({ processed: 0, results: [] });
  }

  const results = await Promise.all(
    due.map(async (post) => {
      try {
        // ---- 将来: X API 連携 ----
        // const xRes = await postToX(post.content);
        // markAsPublished(post.id, xRes.data.id);

        // ---- 現在: ローカル処理 ----
        const updated = markAsPublished(post.id);
        return { id: post.id, status: "published", post: updated };
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        markAsFailed(post.id, msg);
        return { id: post.id, status: "failed", error: msg };
      }
    })
  );

  return NextResponse.json({ processed: results.length, results });
}
