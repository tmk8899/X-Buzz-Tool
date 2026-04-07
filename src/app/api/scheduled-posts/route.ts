import { NextRequest, NextResponse } from "next/server";
import { getAllPosts, createPost } from "@/lib/scheduled-posts-store";
import type { CreateScheduledPostInput } from "@/types/scheduled-post";

/** GET /api/scheduled-posts — 全件取得（?status= でフィルタ可能） */
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  let posts = getAllPosts();
  if (status) {
    posts = posts.filter((p) => p.status === status);
  }
  return NextResponse.json(posts);
}

/** POST /api/scheduled-posts — 新規作成 */
export async function POST(req: NextRequest) {
  let body: CreateScheduledPostInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 422 });
  }
  if (!body.scheduledAt) {
    return NextResponse.json({ error: "scheduledAt is required" }, { status: 422 });
  }

  const post = createPost(body);
  return NextResponse.json(post, { status: 201 });
}
