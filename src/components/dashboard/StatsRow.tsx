import { Eye, Heart, Users, FileText } from "lucide-react";
import type { DashboardStats } from "@/types";

interface StatsRowProps {
  stats: DashboardStats;
}

const cards = [
  {
    key: "totalImpressions" as const,
    label: "総インプレッション",
    icon: Eye,
    growthKey: "impressionsGrowth" as const,
    color: "#4f8ef7",
    bgColor: "rgba(79,142,247,0.08)",
    borderColor: "rgba(79,142,247,0.2)",
    glowColor: "rgba(79,142,247,0.15)",
  },
  {
    key: "totalLikes" as const,
    label: "総いいね数",
    icon: Heart,
    growthKey: "likesGrowth" as const,
    color: "#f472b6",
    bgColor: "rgba(244,114,182,0.08)",
    borderColor: "rgba(244,114,182,0.2)",
    glowColor: "rgba(244,114,182,0.12)",
  },
  {
    key: "totalFollowers" as const,
    label: "フォロワー数",
    icon: Users,
    growthKey: "followersGrowth" as const,
    color: "#9b59f5",
    bgColor: "rgba(155,89,245,0.08)",
    borderColor: "rgba(155,89,245,0.2)",
    glowColor: "rgba(155,89,245,0.15)",
  },
  {
    key: "totalPosts" as const,
    label: "総投稿数",
    icon: FileText,
    growthKey: undefined,
    color: "#00d4ff",
    bgColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.2)",
    glowColor: "rgba(0,212,255,0.12)",
  },
];

function formatNumber(n: number): string {
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  return n.toLocaleString();
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, growthKey, color, bgColor, borderColor, glowColor }) => {
        const growth = growthKey ? stats[growthKey] : undefined;
        const isPositive = growth !== undefined && growth >= 0;
        return (
          <div
            key={key}
            className="rounded-2xl p-5 flex flex-col gap-4 transition-all duration-200"
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 0 24px ${glowColor}`,
            }}
          >
            <div className="flex items-center justify-between">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}18`, border: `1px solid ${color}30` }}
              >
                <Icon size={18} style={{ color }} />
              </div>
              {growth !== undefined && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={
                    isPositive
                      ? { color: "#34d399", background: "rgba(52,211,153,0.12)" }
                      : { color: "#f87171", background: "rgba(248,113,113,0.12)" }
                  }
                >
                  {isPositive ? "+" : ""}{growth.toFixed(1)}%
                </span>
              )}
            </div>
            <div>
              <p className="text-2xl font-bold text-white tracking-tight">
                {formatNumber(stats[key])}
              </p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
