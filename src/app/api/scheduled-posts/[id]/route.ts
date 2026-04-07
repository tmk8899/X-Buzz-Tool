import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost } from "@/lib/scheduled-posts-store";
import type { UpdateScheduledPostInput } from "@/types/scheduled-post";

type Params = { params: Promise<{ id: string }> };

/** GET /api/scheduled-posts/[id] */
export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = getPostById(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

/** PUT /api/scheduled-posts/[id] — 更新 */
export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: UpdateScheduledPostInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const updated = updatePost(id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

/** DELETE /api/scheduled-posts/[id] */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const ok = deletePost(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
