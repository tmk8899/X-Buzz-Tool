"use client";

import { Clock, Pencil, Trash2, XCircle, CalendarClock } from "lucide-react";
import type { ScheduledPost } from "@/types/scheduled-post";
import ScheduleStatusBadge from "./ScheduleStatusBadge";

interface ScheduledPostListProps {
  posts: ScheduledPost[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ScheduledPostList({
  posts,
  onEdit,
  onDelete,
  onCancel,
}: ScheduledPostListProps) {
  if (posts.length === 0) {
    return (
      <div
        className="rounded-2xl p-14 flex flex-col items-center gap-3 text-center"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <CalendarClock size={32} className="text-slate-600" />
        <p className="text-slate-400 text-sm">予約投稿はありません</p>
        <p className="text-slate-600 text-xs">「新規予約」ボタンから追加できます</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150"
          style={{
            background: "rgba(255,255,255,0.03)",
            border:
              post.status === "scheduled"
                ? "1px solid rgba(79,142,247,0.15)"
                : post.status === "published"
                  ? "1px solid rgba(52,211,153,0.15)"
                  : "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {/* Top row */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <ScheduleStatusBadge status={post.status} />
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock size={11} />
                {formatDate(post.scheduledAt)}
              </span>
              {post.publishedAt && (
                <span className="text-xs text-slate-500">
                  → 公開: {formatDate(post.publishedAt)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              {post.status === "scheduled" && (
                <>
                  <button
                    onClick={() => onEdit(post)}
                    title="編集"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-white/5 transition-colors"
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    onClick={() => onCancel(post.id)}
                    title="キャンセル"
                    className="p-1.5 rounded-lg text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  >
                    <XCircle size={13} />
                  </button>
                </>
              )}
              <button
                onClick={() => onDelete(post.id)}
                title="削除"
                className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          </div>

          {/* Content */}
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>

          {/* Error message */}
          {post.status === "failed" && post.errorMessage && (
            <p className="text-xs text-red-400 px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)" }}>
              エラー: {post.errorMessage}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
