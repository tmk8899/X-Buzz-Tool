import Link from "next/link";
import { Sparkles, CalendarClock, History, UserCircle2 } from "lucide-react";

const actions = [
  {
    href: "/generate",
    icon: Sparkles,
    label: "AI投稿生成",
    description: "AIでバズる投稿を自動生成",
    color: "#4f8ef7",
    bg: "rgba(79,142,247,0.08)",
    border: "rgba(79,142,247,0.2)",
    glow: "rgba(79,142,247,0.12)",
  },
  {
    href: "/schedule",
    icon: CalendarClock,
    label: "予約投稿",
    description: "最適な時間に自動投稿",
    color: "#9b59f5",
    bg: "rgba(155,89,245,0.08)",
    border: "rgba(155,89,245,0.2)",
    glow: "rgba(155,89,245,0.12)",
  },
  {
    href: "/history",
    icon: History,
    label: "投稿履歴",
    description: "過去の投稿をチェック",
    color: "#00d4ff",
    bg: "rgba(0,212,255,0.08)",
    border: "rgba(0,212,255,0.2)",
    glow: "rgba(0,212,255,0.1)",
  },
  {
    href: "/persona",
    icon: UserCircle2,
    label: "ペルソナ設定",
    description: "投稿スタイルをカスタマイズ",
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    glow: "rgba(244,114,182,0.1)",
  },
];

export default function QuickActions() {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(155,89,245,0.12)",
      }}
    >
      <h3 className="font-semibold text-white text-sm">クイックアクション</h3>

      <div className="grid grid-cols-2 gap-3">
        {actions.map(({ href, icon: Icon, label, description, color, bg, border, glow }) => (
          <Link
            key={href}
            href={href}
            className="rounded-xl p-4 flex flex-col gap-2.5 transition-all duration-150 hover:scale-[1.02] hover:shadow-lg group"
            style={{
              background: bg,
              border: `1px solid ${border}`,
              boxShadow: `0 0 20px ${glow}`,
            }}
          >
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}25` }}
            >
              <Icon size={16} style={{ color }} />
            </div>
            <div>
              <p className="text-sm font-semibold text-white group-hover:text-white/90">{label}</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
