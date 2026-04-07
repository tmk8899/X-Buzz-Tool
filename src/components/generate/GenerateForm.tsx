"use client";

import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import type { GeneratePostInput } from "@/types/generate";

const TONE_OPTIONS = [
  { id: "casual",   label: "カジュアル",  emoji: "😊" },
  { id: "expert",   label: "専門家",     emoji: "🧑‍💻" },
  { id: "story",    label: "ストーリー", emoji: "📖" },
  { id: "list",     label: "リスト型",   emoji: "📋" },
  { id: "question", label: "問いかけ",   emoji: "🤔" },
  { id: "shock",    label: "インパクト", emoji: "⚡" },
];

const PURPOSE_OPTIONS = [
  "フォロワー増加", "エンゲージメント向上", "商品・サービスPR",
  "実績アピール", "ブランディング", "教育・啓発",
];

const TOPIC_EXAMPLES = ["副業で月10万稼ぐ方法", "TypeScriptの便利テク", "朝活ルーティン"];

interface GenerateFormProps {
  input: GeneratePostInput;
  loading: boolean;
  onChange: (v: Partial<GeneratePostInput>) => void;
  onSubmit: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">{children}</label>;
}

function TextInput({
  value, onChange, placeholder, rows,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  const cls = "w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none";
  const style = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };
  return rows
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls} style={style} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} style={style} />;
}

export default function GenerateForm({ input, loading, onChange, onSubmit }: GenerateFormProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(79,142,247,0.12)",
      }}
    >
      {/* テーマ */}
      <div className="flex flex-col gap-2">
        <FieldLabel>テーマ・キーワード *</FieldLabel>
        <TextInput
          value={input.topic}
          onChange={(v) => onChange({ topic: v })}
          placeholder="例: フリーランスエンジニアが月収を上げる3つの習慣"
          rows={2}
        />
        <div className="flex items-center gap-1.5 flex-wrap">
          <Lightbulb size={11} className="text-yellow-400/60" />
          {TOPIC_EXAMPLES.map((ex) => (
            <button
              key={ex}
              onClick={() => onChange({ topic: ex })}
              className="text-xs px-2 py-0.5 rounded-full transition-colors hover:text-white"
              style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", color: "#7aa8f7" }}
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {/* ターゲット */}
      <div className="flex flex-col gap-2">
        <FieldLabel>ターゲット</FieldLabel>
        <TextInput
          value={input.target}
          onChange={(v) => onChange({ target: v })}
          placeholder="例: 副業に興味があるエンジニア（20〜30代）"
        />
      </div>

      {/* 目的 */}
      <div className="flex flex-col gap-2">
        <FieldLabel>投稿の目的</FieldLabel>
        <div className="grid grid-cols-2 gap-1.5">
          {PURPOSE_OPTIONS.map((p) => (
            <button
              key={p}
              onClick={() => onChange({ purpose: p })}
              className="py-2 px-3 rounded-xl text-xs text-left transition-all"
              style={
                input.purpose === p
                  ? { background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.35)", color: "#7aa8f7" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }
              }
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* トーン */}
      <div className="flex flex-col gap-2">
        <FieldLabel>投稿スタイル</FieldLabel>
        <div className="grid grid-cols-3 gap-1.5">
          {TONE_OPTIONS.map((t) => (
            <button
              key={t.id}
              onClick={() => onChange({ tone: t.id })}
              className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs transition-all"
              style={
                input.tone === t.id
                  ? { background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.35)", color: "#7aa8f7" }
                  : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", color: "#64748b" }
              }
            >
              <span>{t.emoji}</span>
              <span className="font-medium">{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 文字数 & CTA */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <FieldLabel>目安文字数</FieldLabel>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={60}
              max={280}
              step={10}
              value={input.maxChars}
              onChange={(e) => onChange({ maxChars: Number(e.target.value) })}
              className="flex-1 accent-blue-500"
            />
            <span className="text-sm font-medium text-white w-10 text-right">{input.maxChars}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel>CTA（行動促進）</FieldLabel>
          <button
            onClick={() => onChange({ hasCta: !input.hasCta })}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all self-start"
            style={
              input.hasCta
                ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }
                : { background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b" }
            }
          >
            <span>{input.hasCta ? "✓" : "○"}</span>
            {input.hasCta ? "CTA あり" : "CTA なし"}
          </button>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={onSubmit}
        disabled={!input.topic.trim() || loading}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 mt-1"
        style={{
          background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
          color: "white",
          boxShadow: "0 0 20px rgba(79,142,247,0.3)",
        }}
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? "生成中..." : "3パターン生成する"}
      </button>
    </div>
  );
}
