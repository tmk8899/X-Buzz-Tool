/**
 * 予約投稿のlocalStorageストア
 * サーバー再起動・再デプロイでもデータが消えない
 */

import type { ScheduledPost, CreateScheduledPostInput } from "@/types/scheduled-post";

const KEY = "scheduledPosts";

function load(): ScheduledPost[] {
  if (typeof window === "undefined") return [];
  try {
    const saved = localStorage.getItem(KEY);
    return saved ? (JSON.parse(saved) as ScheduledPost[]) : [];
  } catch {
    return [];
  }
}

function save(posts: ScheduledPost[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(posts));
  } catch {}
}

function uuid(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export const scheduleStore = {
  getAll(): ScheduledPost[] {
    return load().sort(
      (a, b) => new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    );
  },

  create(input: CreateScheduledPostInput): ScheduledPost {
    const posts = load();
    const now = new Date().toISOString();
    const post: ScheduledPost = {
      id: uuid(),
      content: input.content,
      scheduledAt: input.scheduledAt,
      status: "scheduled",
      createdAt: now,
      updatedAt: now,
    };
    save([...posts, post]);
    return post;
  },

  update(id: string, changes: Partial<ScheduledPost>): ScheduledPost | null {
    const posts = load();
    const idx = posts.findIndex((p) => p.id === id);
    if (idx < 0) return null;
    const updated = { ...posts[idx], ...changes, updatedAt: new Date().toISOString() };
    posts[idx] = updated;
    save(posts);
    return updated;
  },

  delete(id: string): void {
    save(load().filter((p) => p.id !== id));
  },

  /** 予約時刻が過ぎてまだ "scheduled" のものを返す */
  getDue(): ScheduledPost[] {
    const now = new Date();
    return load().filter(
      (p) => p.status === "scheduled" && new Date(p.scheduledAt) <= now
    );
  },
};
