/**
 * ScheduledPost の永続化層
 *
 * 現在: Node.js のプロセスメモリ（サーバー再起動でリセット）
 * → 将来: この関数群を Supabase クライアント呼び出しに差し替えるだけで移行完了
 *
 * ※ App Router の API Route はサーバーサイドで動くため、
 *    localStorage は使えない。ここではサーバーメモリに保持する。
 *    開発 / MVP 用途として割り切った実装。
 */

import { randomUUID } from "crypto";
import type {
  ScheduledPost,
  CreateScheduledPostInput,
  UpdateScheduledPostInput,
} from "@/types/scheduled-post";

// ---------- In-memory store ----------
// Next.js dev では HMR でリセットされることがあるため、
// globalThis にアタッチして再利用する
declare global {
  // eslint-disable-next-line no-var
  var __scheduledPostsStore: Map<string, ScheduledPost> | undefined;
}

function getStore(): Map<string, ScheduledPost> {
  if (!globalThis.__scheduledPostsStore) {
    globalThis.__scheduledPostsStore = new Map();
    seedStore(globalThis.__scheduledPostsStore);
  }
  return globalThis.__scheduledPostsStore;
}

/** 開発用初期データ */
function seedStore(store: Map<string, ScheduledPost>) {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const dayAfter = new Date(now.getTime() + 48 * 60 * 60 * 1000);

  const seeds: ScheduledPost[] = [
    {
      id: "seed-1",
      content:
        "Next.js 15 のApp Routerで爆速サイトを作る方法\n\nServer Componentsを使えばバンドルサイズが劇的に減少。体感速度が別次元になります🚀",
      scheduledAt: tomorrow.toISOString(),
      status: "scheduled",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
    {
      id: "seed-2",
      content:
        "今日の朝活ルーティン\n\n5:30 起床\n5:45 瞑想10分\n6:00 技術記事3本読む\n7:00 コーディング\n\n朝の集中力は夜の3倍✨",
      scheduledAt: dayAfter.toISOString(),
      status: "scheduled",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    },
  ];

  seeds.forEach((s) => store.set(s.id, s));
}

// ---------- CRUD ----------

export function getAllPosts(): ScheduledPost[] {
  return Array.from(getStore().values()).sort(
    (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
  );
}

export function getPostById(id: string): ScheduledPost | null {
  return getStore().get(id) ?? null;
}

export function createPost(input: CreateScheduledPostInput): ScheduledPost {
  const now = new Date().toISOString();
  const post: ScheduledPost = {
    id: randomUUID(),
    content: input.content,
    scheduledAt: input.scheduledAt,
    status: "scheduled",
    createdAt: now,
    updatedAt: now,
  };
  getStore().set(post.id, post);
  return post;
}

export function updatePost(
  id: string,
  input: UpdateScheduledPostInput
): ScheduledPost | null {
  const store = getStore();
  const existing = store.get(id);
  if (!existing) return null;

  const updated: ScheduledPost = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };
  store.set(id, updated);
  return updated;
}

export function deletePost(id: string): boolean {
  return getStore().delete(id);
}

/**
 * cron / 外部ジョブ向け:
 * scheduledAt が現在時刻以前で status === "scheduled" の投稿を返す
 */
export function getDuePosts(): ScheduledPost[] {
  const now = new Date();
  return getAllPosts().filter(
    (p) => p.status === "scheduled" && new Date(p.scheduledAt) <= now
  );
}

/**
 * 投稿済みとしてマーク（X API 連携後に xPostId を保存）
 */
export function markAsPublished(id: string, xPostId?: string): ScheduledPost | null {
  return updatePost(id, {
    status: "published",
    ...(xPostId ? { xPostId } : {}),
  } as UpdateScheduledPostInput & { xPostId?: string });
}

export function markAsFailed(id: string, errorMessage: string): ScheduledPost | null {
  const store = getStore();
  const existing = store.get(id);
  if (!existing) return null;
  const updated: ScheduledPost = {
    ...existing,
    status: "failed",
    errorMessage,
    updatedAt: new Date().toISOString(),
  };
  store.set(id, updated);
  return updated;
}
