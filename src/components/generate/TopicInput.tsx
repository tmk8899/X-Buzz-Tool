"use client";

import { Lightbulb } from "lucide-react";

const EXAMPLES = ["副業で月10万稼ぐ方法", "TypeScriptの便利テク", "朝活ルーティン", "AIツール活用術"];

interface TopicInputProps {
  value: string;
  onChange: (v: string) => void;
}

export default function TopicInput({ value, onChange }: TopicInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-300">テーマ・キーワード</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="例: フリーランスエンジニアが月収を上げるための3つの習慣"
        rows={3}
        className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none outline-none transition-all focus:ring-2 focus:ring-blue-500/40"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      />
      <div className="flex items-center gap-2 flex-wrap">
        <Lightbulb size={12} className="text-yellow-400/60" />
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            onClick={() => onChange(ex)}
            className="text-xs px-2.5 py-1 rounded-full transition-colors hover:text-white"
            style={{
              background: "rgba(79,142,247,0.08)",
              border: "1px solid rgba(79,142,247,0.2)",
              color: "#7aa8f7",
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  );
}
