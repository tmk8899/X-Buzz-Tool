"use client";

import { Lightbulb, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import type { GeneratePostInput } from "@/types/generate";

const TONE_OPTIONS = [
  {
    id: "problem",
    label: "問題提起型",
    emoji: "❓",
    hint: "共感する「あるある問題」を提示 → 原因 → 解決策",
  },
  {
    id: "contrast",
    label: "対比型",
    emoji: "⚖️",
    hint: "「〇〇な人 vs △△な人」で違いを対比させる",
  },
  {
    id: "story",
    label: "体験談型",
    emoji: "📖",
    hint: "実体験フック → 背景 → ターニングポイント → 学び",
  },
  {
    id: "list",
    label: "箇条書き型",
    emoji: "📋",
    hint: "価値あるリストを番号付きで簡潔に列挙する",
  },
  {
    id: "conclusion",
    label: "結論先出し型",
    emoji: "🎯",
    hint: "結論を冒頭で断言 → 理由・根拠 → 具体例",
  },
  {
    id: "bait",
    label: "煽りフック型",
    emoji: "🔥",
    hint: "常識を否定する逆張りフック → 意外な答えで着地",
  },
  {
    id: "thread",
    label: "教育スレッド型",
    emoji: "🧵",
    hint: "章立て予告 → ステップ解説 → まとめ＋保存CTA",
  },  
  {
    id: "empathy",
    label: "共感型",
    emoji: "💬",
    hint: "悩みや違和感に共感させる構成",
  },
];

const PURPOSE_OPTIONS = [
  { id: "フォロワー増加",    emoji: "👥" },
  { id: "エンゲージメント向上", emoji: "💬" },
  { id: "商品・サービスPR",  emoji: "📣" },
  { id: "実績アピール",      emoji: "🏆" },
  { id: "ブランディング",    emoji: "✨" },
  { id: "教育・啓発",       emoji: "📚" },
  { id: "共感",             emoji: "🤝" },
];

const RECENT_KEY = "recentTopics";

interface GenerateFormProps {
  input: GeneratePostInput;
  loading: boolean;
  onChange: (v: Partial<GeneratePostInput>) => void;
  onSubmit: () => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="text-sm font-medium text-slate-200 tracking-wide">{children}</label>;
}


function TextInput({
  value, onChange, placeholder, rows,
}: {
  value: string; onChange: (v: string) => void; placeholder: string; rows?: number;
}) {
  const cls = "w-full rounded-xl px-4 py-3 text-base text-slate-100 placeholder-slate-400 outline-none focus:ring-2 focus:ring-blue-500/40 transition-all resize-none";
  const style = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" };
  return rows
    ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows} className={cls} style={style} />
    : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} style={style} />;
}

export default function GenerateForm({ input, loading, onChange, onSubmit }: GenerateFormProps) {
  const [recentTopics, setRecentTopics] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) setRecentTopics(JSON.parse(saved));
    } catch {}
  }, []);

  const handleSubmit = () => {
    const topic = input.topic.trim();
    if (topic) {
      const next = [topic, ...recentTopics.filter((t) => t !== topic)].slice(0, 5);
      setRecentTopics(next);
      try { localStorage.setItem(RECENT_KEY, JSON.stringify(next)); } catch {}
    }
    onSubmit();
  };

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
        {recentTopics.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Lightbulb size={11} className="text-yellow-400/60 shrink-0" />
            <span className="text-[10px] text-slate-500">最近使ったテーマ：</span>
            {recentTopics.map((ex) => (
              <button
                key={ex}
                onClick={() => onChange({ topic: ex })}
                className="text-xs px-2 py-0.5 rounded-full transition-colors hover:text-white truncate max-w-[150px]"
                style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.2)", color: "#7aa8f7" }}
              >
                {ex}
              </button>
            ))}
          </div>
        )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {PURPOSE_OPTIONS.map((p) => {
            const active = input.purpose === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onChange({ purpose: p.id })}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                style={
                  active
                    ? { background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.4)", boxShadow: "0 0 10px rgba(79,142,247,0.12)" }
                    : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }
                }
              >
                <span className="text-base shrink-0">{p.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: active ? "#7aa8f7" : "#94a3b8" }}>
                  {p.id}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* バズ投稿型 */}
      <div className="flex flex-col gap-2">
        <FieldLabel>バズ投稿の型</FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {TONE_OPTIONS.map((t) => {
            const active = input.tone === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChange({ tone: t.id })}
                className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all"
                style={
                  active
                    ? { background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.4)", boxShadow: "0 0 10px rgba(79,142,247,0.12)" }
                    : { background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }
                }
              >
                <span className="text-base shrink-0">{t.emoji}</span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: active ? "#7aa8f7" : "#94a3b8" }}
                >
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* 選択中の型の説明 */}
        {(() => {
          const selected = TONE_OPTIONS.find((t) => t.id === input.tone);
          return selected ? (
            <p
              className="text-xs px-3 py-2 rounded-xl"
              style={{
                background: "rgba(79,142,247,0.06)",
                border: "1px solid rgba(79,142,247,0.12)",
                color: "#7aa8f7",
              }}
            >
              {selected.emoji} <span className="font-medium">{selected.label}</span>
              {" — "}{selected.hint}
            </p>
          ) : null;
        })()}
      </div>

      {/* 追加指示 */}
<div className="flex flex-col gap-2">
  <FieldLabel>追加指示（任意）</FieldLabel>
  <TextInput
    value={(input as any).customInstruction || ""}
    onChange={(v) => onChange({ customInstruction: v } as any)}
    placeholder="例：フック強め、共感重視、リライト希望"
    rows={2}
  />
</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <button
        onClick={handleSubmit}
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
