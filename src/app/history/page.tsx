"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/layout/PageHeader";
import HistoryFilter from "@/components/history/HistoryFilter";
import HistoryPostCard from "@/components/history/HistoryPostCard";
import { dummyPosts } from "@/lib/dummy-data";
import type { Post, PostStatus } from "@/types";

const STORAGE_KEY = "historyPosts";

function loadPosts(): Post[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as Post[];
  } catch {}
  return dummyPosts;
}

function savePosts(posts: Post[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch {}
}

export default function HistoryPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setPosts(loadPosts());
    setMounted(true);
  }, []);

  const handleDelete = (id: string) => {
    const next = posts.filter((p) => p.id !== id);
    setPosts(next);
    savePosts(next);
  };

  const filtered = posts.filter((p) => {
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
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
