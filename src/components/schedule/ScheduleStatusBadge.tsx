import type { ScheduledPostStatus } from "@/types/scheduled-post";

const CONFIG: Record<ScheduledPostStatus, { label: string; color: string; bg: string; border: string }> = {
  scheduled:  { label: "予約中",   color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  border: "rgba(96,165,250,0.25)" },
  published:  { label: "公開済み", color: "#34d399", bg: "rgba(52,211,153,0.1)",  border: "rgba(52,211,153,0.25)" },
  failed:     { label: "失敗",     color: "#f87171", bg: "rgba(248,113,113,0.1)", border: "rgba(248,113,113,0.25)" },
  cancelled:  { label: "キャンセル", color: "#94a3b8", bg: "rgba(148,163,184,0.08)", border: "rgba(148,163,184,0.2)" },
};

export default function ScheduleStatusBadge({ status }: { status: ScheduledPostStatus }) {
  const c = CONFIG[status];
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: c.color, background: c.bg, border: `1px solid ${c.border}` }}
    >
      {c.label}
    </span>
  );
}
