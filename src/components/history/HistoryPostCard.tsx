import { Eye, Heart, Repeat2, MessageCircle, Trash2 } from "lucide-react";
import type { Post } from "@/types";
import NeonBadge from "@/components/ui/NeonBadge";

const STATUS_CONFIG = {
  published: { label: "公開済み", color: "green" as const },
  scheduled: { label: "予約中",  color: "blue" as const },
  draft:     { label: "下書き",  color: "purple" as const },
  failed:    { label: "失敗",    color: "red" as const },
};

function fmt(n: number) {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000)  return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

interface HistoryPostCardProps {
  post: Post;
  onDelete?: (id: string) => void;
}

export default function HistoryPostCard({ post, onDelete }: HistoryPostCardProps) {
  const cfg = STATUS_CONFIG[post.status];
  // 公開済み・下書きのみ削除可能（予約中はスケジュールページで管理）
  const canDelete = post.status === "published" || post.status === "draft";

  const handleDelete = () => {
    if (!onDelete) return;
    if (confirm("この投稿を削除しますか？")) onDelete(post.id);
  };

  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 transition-all duration-150 hover:border-white/10"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-slate-300 leading-relaxed flex-1">{post.content}</p>
        <div className="flex items-center gap-2 shrink-0">
          <NeonBadge color={cfg.color}>{cfg.label}</NeonBadge>
          {canDelete && onDelete && (
            <button
              onClick={handleDelete}
              className="p-1.5 rounded-lg transition-all hover:opacity-80"
              style={{
                background: "rgba(248,113,113,0.1)",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "#f87171",
              }}
              title="削除"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-5 text-xs text-slate-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <Eye size={12} />{fmt(post.impressions)}
        </span>
        <span className="flex items-center gap-1.5">
          <Heart size={12} className="text-pink-500/60" />{fmt(post.likes)}
        </span>
        <span className="flex items-center gap-1.5">
          <Repeat2 size={12} className="text-green-500/60" />{fmt(post.retweets)}
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle size={12} />{fmt(post.replies)}
        </span>
        {post.publishedAt && (
          <span className="ml-auto">
            {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
          </span>
        )}
      </div>
    </div>
  );
}
