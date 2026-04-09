"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ScheduledPostList from "@/components/schedule/ScheduledPostList";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import type { ScheduledPost, ScheduledPostStatus } from "@/types/scheduled-post";

const STATUS_TABS: { value: ScheduledPostStatus | "all"; label: string }[] = [
  { value: "all",       label: "すべて" },
  { value: "scheduled", label: "予約中" },
  { value: "published", label: "公開済み" },
  { value: "failed",    label: "失敗" },
  { value: "cancelled", label: "キャンセル" },
];

export default function SchedulePage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [filterStatus, setFilterStatus] = useState<ScheduledPostStatus | "all">("all");
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<ScheduledPost | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // ---------- fetch ----------
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/scheduled-posts");
      const data = await res.json();
      setPosts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // ---------- derived ----------
  const filtered = filterStatus === "all"
    ? posts
    : posts.filter((p) => p.status === filterStatus);

  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  // ---------- handlers ----------
  const handleSaved = (saved: ScheduledPost) => {
    setPosts((prev) => {
      const idx = prev.findIndex((p) => p.id === saved.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = saved;
        return next;
      }
      return [...prev, saved];
    });
    setShowForm(false);
    setEditTarget(undefined);
  };

  const handleEdit = (post: ScheduledPost) => {
    setEditTarget(post);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("この予約投稿を削除しますか？")) return;
    await fetch(`/api/scheduled-posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCancel = async (id: string) => {
    const res = await fetch(`/api/scheduled-posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "cancelled" }),
    });
    if (res.ok) {
      const updated: ScheduledPost = await res.json();
      setPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
    }
  };

  const handleOpenNew = () => {
    setEditTarget(undefined);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditTarget(undefined);
  };

  return (
    <div className="min-h-full p-4 lg:p-8">
      <PageHeader
        title="予約投稿"
        description="投稿日時を設定してスケジュール管理"
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={fetchPosts}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="更新"
            >
              <RefreshCw size={15} />
            </button>
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
                color: "white",
                boxShadow: "0 0 16px rgba(79,142,247,0.3)",
              }}
            >
              <Plus size={15} />
              新規予約
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 items-start">
        {/* Left: list */}
        <div className="flex flex-col gap-4">
          {/* Status tabs */}
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            {STATUS_TABS.map((tab) => {
              const count = tab.value === "all" ? posts.length : (counts[tab.value] ?? 0);
              return (
                <button
                  key={tab.value}
                  onClick={() => setFilterStatus(tab.value)}
                  className="flex items-center gap-1.5 flex-1 justify-center py-1.5 rounded-lg text-xs font-medium transition-all"
                  style={
                    filterStatus === tab.value
                      ? { background: "rgba(79,142,247,0.15)", color: "#7aa8f7", border: "1px solid rgba(79,142,247,0.25)" }
                      : { color: "#64748b" }
                  }
                >
                  {tab.label}
                  {count > 0 && (
                    <span
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-bold"
                      style={
                        filterStatus === tab.value
                          ? { background: "rgba(79,142,247,0.2)", color: "#7aa8f7" }
                          : { background: "rgba(255,255,255,0.07)", color: "#64748b" }
                      }
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl h-28 animate-pulse"
                  style={{ background: "rgba(255,255,255,0.03)" }}
                />
              ))}
            </div>
          ) : (
            <ScheduledPostList
              posts={filtered}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCancel={handleCancel}
            />
          )}
        </div>

        {/* Right: form */}
        {showForm && (
          <ScheduleForm
            editTarget={editTarget}
            onClose={handleCloseForm}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
