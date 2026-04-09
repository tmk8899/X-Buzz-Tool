"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ScheduledPostList from "@/components/schedule/ScheduledPostList";
import ScheduleForm from "@/components/schedule/ScheduleForm";
import { scheduleStore } from "@/lib/schedule-store";
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
  const [mounted, setMounted] = useState(false);

  const reload = () => setPosts(scheduleStore.getAll());

  useEffect(() => {
    reload();
    setMounted(true);
    // 30秒ごとに期限チェック（画面を開いたまま投稿時刻を迎えた場合に更新）
    const timer = setInterval(reload, 30_000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  const filtered = filterStatus === "all"
    ? posts
    : posts.filter((p) => p.status === filterStatus);

  const counts = posts.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] ?? 0) + 1;
    return acc;
  }, {});

  // ---- handlers ----
  const handleSaved = (saved: ScheduledPost) => {
    reload();
    setShowForm(false);
    setEditTarget(undefined);
  };

  const handleEdit = (post: ScheduledPost) => {
    setEditTarget(post);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (!confirm("この予約投稿を削除しますか？")) return;
    scheduleStore.delete(id);
    reload();
  };

  const handleCancel = (id: string) => {
    scheduleStore.update(id, { status: "cancelled" });
    reload();
  };

  const handlePosted = (id: string) => {
    scheduleStore.update(id, {
      status: "published",
      publishedAt: new Date().toISOString(),
    } as Partial<ScheduledPost>);
    reload();
  };

  return (
    <div className="min-h-full p-4 lg:p-8">
      <PageHeader
        title="予約投稿"
        description="投稿日時を設定してスケジュール管理"
        actions={
          <button
            onClick={() => { setEditTarget(undefined); setShowForm(true); }}
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

          <ScheduledPostList
            posts={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCancel={handleCancel}
            onPosted={handlePosted}
          />
        </div>

        {/* Right: form */}
        {showForm && (
          <ScheduleForm
            editTarget={editTarget}
            onClose={() => { setShowForm(false); setEditTarget(undefined); }}
            onSaved={handleSaved}
          />
        )}
      </div>
    </div>
  );
}
