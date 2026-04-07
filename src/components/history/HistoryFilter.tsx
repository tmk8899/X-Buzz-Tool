"use client";

import { Search } from "lucide-react";
import type { PostStatus } from "@/types";

const STATUS_TABS: { value: PostStatus | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "published", label: "公開済み" },
  { value: "scheduled", label: "予約中" },
  { value: "draft", label: "下書き" },
];

interface HistoryFilterProps {
  status: PostStatus | "all";
  search: string;
  onStatusChange: (v: PostStatus | "all") => void;
  onSearchChange: (v: string) => void;
}

export default function HistoryFilter({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: HistoryFilterProps) {
  return (
    <div className="flex flex-col gap-3">
      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="投稿を検索..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* Status tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onStatusChange(tab.value)}
            className="flex-1 py-1.5 rounded-lg text-xs font-medium transition-all"
            style={
              status === tab.value
                ? {
                    background: "rgba(79,142,247,0.15)",
                    color: "#7aa8f7",
                    border: "1px solid rgba(79,142,247,0.25)",
                  }
                : { color: "#64748b" }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
