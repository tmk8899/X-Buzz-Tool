"use client";

import { Save } from "lucide-react";
import type { Memo } from "@/types";

interface MemoEditorProps {
  memo: Memo | null;
  onClose: () => void;
}

export default function MemoEditor({ memo, onClose }: MemoEditorProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(155,89,245,0.2)",
        boxShadow: "0 0 30px rgba(155,89,245,0.08)",
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">
          {memo ? "メモを編集" : "新規メモ"}
        </h3>
        <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-300">
          ✕ 閉じる
        </button>
      </div>

      <input
        defaultValue={memo?.title ?? ""}
        placeholder="タイトル"
        className="rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      <textarea
        defaultValue={memo?.content ?? ""}
        placeholder="メモ内容..."
        rows={10}
        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      <input
        defaultValue={memo?.tags.join(", ") ?? ""}
        placeholder="タグ (カンマ区切り)"
        className="rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      <button
        className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #9b59f5, #4f8ef7)",
          color: "white",
          boxShadow: "0 0 16px rgba(155,89,245,0.3)",
        }}
      >
        <Save size={14} />
        保存する
      </button>
    </div>
  );
}
