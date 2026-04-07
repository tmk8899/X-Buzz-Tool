import { Heart, Repeat2, MessageCircle, Eye, TrendingUp } from "lucide-react";
import type { Post } from "@/types";
import NeonBadge from "@/components/ui/NeonBadge";

interface RecentPostsProps {
  posts: Post[];
}

const statusConfig = {
  published: { label: "公開済み", color: "green" as const },
  scheduled: { label: "予約中", color: "blue" as const },
  draft: { label: "下書き", color: "purple" as const },
  failed: { label: "失敗", color: "red" as const },
};

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return n.toString();
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  const published = posts.filter((p) => p.status === "published").slice(0, 5);

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(79,142,247,0.12)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={17} className="text-blue-400" />
          <h3 className="font-semibold text-white text-sm">最近のバズ投稿</h3>
        </div>
        <a href="/history" className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
          すべて見る →
        </a>
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-3">
        {published.map((post) => (
          <div
            key={post.id}
            className="rounded-xl p-4 flex flex-col gap-3 transition-all duration-150 hover:border-blue-500/20 cursor-pointer group"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2 flex-1 group-hover:text-white transition-colors">
                {post.content}
              </p>
              <NeonBadge color={statusConfig[post.status].color}>
                {statusConfig[post.status].label}
              </NeonBadge>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Eye size={12} />
                {formatNumber(post.impressions)}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart size={12} className="text-pink-500/60" />
                {formatNumber(post.likes)}
              </span>
              <span className="flex items-center gap-1.5">
                <Repeat2 size={12} className="text-green-500/60" />
                {formatNumber(post.retweets)}
              </span>
              <span className="flex items-center gap-1.5">
                <MessageCircle size={12} />
                {formatNumber(post.replies)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
