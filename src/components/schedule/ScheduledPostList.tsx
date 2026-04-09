"use client";

import { Clock, Pencil, Trash2, XCircle, CalendarClock } from "lucide-react";
import type { ScheduledPost } from "@/types/scheduled-post";
import ScheduleStatusBadge from "./ScheduleStatusBadge";

interface ScheduledPostListProps {
  posts: ScheduledPost[];
  onEdit: (post: ScheduledPost) => void;
  onDelete: (id: string) => void;
  onCancel: (id: string) => void;
  onPosted: (id: string) => void; // 投稿済みにマーク
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ja-JP", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isDue(iso: string): boolean {
  return new Date(iso) <= new Date();
}

// XアプリをURLスキームで開く（インストール済みならアプリ、なければWeb）
function openXApp(text: string) {
  const encoded = encodeURIComponent(text);
  // twitter:// スキームでXアプリを開く試み
  window.location.href = `twitter://post?message=${encoded}`;
  // アプリが起動しなかった場合のWebフォールバック
  setTimeout(() => {
    window.open(`https://x.com/intent/post?text=${encoded}`, "_blank", "noopener,noreferrer");
  }, 1500);
}

function XIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function ScheduledPostList({
  posts,
  onEdit,
  onDelete,
  onCancel,
  onPosted,
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
      {posts.map((post) => {
        const due = post.status === "scheduled" && isDue(post.scheduledAt);
        return (
          <div
            key={post.id}
            className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150"
            style={{
              background: due
                ? "rgba(251,191,36,0.06)"
                : "rgba(255,255,255,0.03)",
              border: due
                ? "1px solid rgba(251,191,36,0.35)"
                : post.status === "scheduled"
                  ? "1px solid rgba(79,142,247,0.15)"
                  : post.status === "published"
                    ? "1px solid rgba(52,211,153,0.15)"
                    : "1px solid rgba(255,255,255,0.06)",
              boxShadow: due ? "0 0 16px rgba(251,191,36,0.08)" : "none",
            }}
          >
            {/* Top row */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <ScheduleStatusBadge status={post.status} />
                {due && (
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
                    style={{ background: "rgba(251,191,36,0.15)", color: "#fbbf24" }}
                  >
                    ⏰ 投稿時刻です
                  </span>
                )}
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
                {post.status === "scheduled" && !due && (
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

            {/* 投稿時刻到来 → Xアプリで投稿ボタン */}
            {due && (
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => {
                    openXApp(post.content);
                    // 少し待ってから「投稿した」として処理
                    setTimeout(() => {
                      if (confirm("Xへの投稿は完了しましたか？")) {
                        onPosted(post.id);
                      }
                    }, 2000);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{
                    background: "rgba(0,0,0,0.8)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "#ffffff",
                  }}
                >
                  <XIcon size={13} />
                  Xアプリで今すぐ投稿
                </button>
                <button
                  onClick={() => onCancel(post.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs transition-all hover:opacity-80"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#64748b",
                  }}
                >
                  スキップ
                </button>
              </div>
            )}

            {/* Error message */}
            {post.status === "failed" && post.errorMessage && (
              <p className="text-xs text-red-400 px-3 py-2 rounded-lg" style={{ background: "rgba(248,113,113,0.08)" }}>
                エラー: {post.errorMessage}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
