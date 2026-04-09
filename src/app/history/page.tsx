"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import HistoryFilter from "@/components/history/HistoryFilter";
import HistoryPostCard from "@/components/history/HistoryPostCard";
import { dummyPosts } from "@/lib/dummy-data";
import type { Post, PostStatus } from "@/types";
import { scheduleStore } from "@/lib/schedule-store";

const STORAGE_KEY = "historyPosts";

function loadLocalPosts(): Post[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      // localStorageにある場合、scheduled以外だけ使う（予約中はAPIから取得）
      const posts = JSON.parse(saved) as Post[];
      return posts.filter((p) => p.status !== "scheduled");
    }
  } catch {}
  // 初回：dummyPostsのscheduled以外だけ保存
  const nonScheduled = dummyPosts.filter((p) => p.status !== "scheduled");
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nonScheduled)); } catch {}
  return nonScheduled;
}

function savePosts(posts: Post[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

// ScheduledPostをPost形式に変換
function toPost(sp: { id: string; content: string; scheduledAt: string; publishedAt?: string }): Post {
  return {
    id: sp.id,
    content: sp.content,
    status: "scheduled",
    scheduledAt: sp.scheduledAt,
    publishedAt: sp.publishedAt,
    likes: 0,
    retweets: 0,
    replies: 0,
    impressions: 0,
  };
}

export default function HistoryPage() {
  const [localPosts, setLocalPosts] = useState<Post[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLocalPosts(loadLocalPosts());
    setMounted(true);

    // 予約中はlocalStorageの予約ストアから取得（予約ページと同じデータ）
    const scheduled = scheduleStore.getAll().filter((p) => p.status === "scheduled");
    setScheduledPosts(scheduled.map(toPost));
  }, []);

  // 全投稿 = localPosts(published/draft) + scheduledPosts
  const allPosts = [...localPosts, ...scheduledPosts];

  const handleDelete = (id: string) => {
    const next = localPosts.filter((p) => p.id !== id);
    setLocalPosts(next);
    savePosts(next);
  };

  const filtered = allPosts.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (search && !p.content.includes(search)) return false;
    return true;
  });

  if (!mounted) return null;

  return (
    <div className="min-h-full p-4 lg:p-8">
      <PageHeader
        title="投稿履歴"
        description="過去のすべての投稿を確認・分析"
      />

      <div className="flex flex-col gap-5">
        <HistoryFilter
          status={status}
          search={search}
          onStatusChange={setStatus}
          onSearchChange={setSearch}
        />

        <p className="text-xs text-slate-500">{filtered.length} 件</p>

        {filtered.length === 0 ? (
          <div
            className="rounded-2xl p-10 text-center text-slate-500 text-sm"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            該当する投稿はありません
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((post) => (
              <HistoryPostCard
                key={post.id}
                post={post}
                onDelete={post.status !== "scheduled" ? handleDelete : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
