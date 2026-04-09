"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import HistoryFilter from "@/components/history/HistoryFilter";
import HistoryPostCard from "@/components/history/HistoryPostCard";
import { dummyPosts } from "@/lib/dummy-data";
import type { PostStatus } from "@/types";

export default function HistoryPage() {
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filtered = dummyPosts.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (search && !p.content.includes(search)) return false;
    return true;
  });

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
              <HistoryPostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
