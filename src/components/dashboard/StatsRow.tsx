import { Eye, Heart, Users, FileText } from "lucide-react";

export interface StatsData {
  totalImpressions: number | null;
  totalLikes: number | null;
  totalFollowers: number | null;
  totalPosts: number | null;
}

interface StatsRowProps {
  stats: StatsData;
  loading?: boolean;
}

const cards = [
  {
    key: "totalImpressions" as const,
    label: "最近20件のインプレッション",
    icon: Eye,
    color: "#4f8ef7",
    bgColor: "rgba(79,142,247,0.08)",
    borderColor: "rgba(79,142,247,0.2)",
    glowColor: "rgba(79,142,247,0.15)",
  },
  {
    key: "totalLikes" as const,
    label: "最近20件のいいね合計",
    icon: Heart,
    color: "#f472b6",
    bgColor: "rgba(244,114,182,0.08)",
    borderColor: "rgba(244,114,182,0.2)",
    glowColor: "rgba(244,114,182,0.12)",
  },
  {
    key: "totalFollowers" as const,
    label: "フォロワー数",
    icon: Users,
    color: "#9b59f5",
    bgColor: "rgba(155,89,245,0.08)",
    borderColor: "rgba(155,89,245,0.2)",
    glowColor: "rgba(155,89,245,0.15)",
  },
  {
    key: "totalPosts" as const,
    label: "総投稿数",
    icon: FileText,
    color: "#00d4ff",
    bgColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.2)",
    glowColor: "rgba(0,212,255,0.12)",
  },
];

function formatNumber(n: number | null): string {
  if (n === null) return "---";
  if (n >= 10000) return (n / 10000).toFixed(1) + "万";
  return n.toLocaleString();
}

export default function StatsRow({ stats, loading }: StatsRowProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bgColor, borderColor, glowColor }) => (
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
          </div>
          <div>
            <p
              className="text-2xl font-bold tracking-tight"
              style={{ color: loading || stats[key] === null ? "#475569" : "white" }}
            >
              {loading ? "…" : formatNumber(stats[key])}
            </p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
