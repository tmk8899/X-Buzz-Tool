"use client";

import { useState, useEffect } from "react";
import { CalendarClock, Save, Loader2 } from "lucide-react";
import type { ScheduledPost } from "@/types/scheduled-post";

const BEST_TIMES = [
  { label: "朝 7:00",    value: "07:00", note: "通勤時間帯" },
  { label: "昼 12:30",   value: "12:30", note: "ランチタイム" },
  { label: "夜 21:00",   value: "21:00", note: "最高エンゲージ" },
  { label: "深夜 23:00", value: "23:00", note: "夜活層向け" },
];

function toLocalDateValue(iso: string) {
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}
function toLocalTimeValue(iso: string) {
  const d = new Date(iso);
  return d.toTimeString().slice(0, 5);
}
function toISOString(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}

interface ScheduleFormProps {
  /** 編集時に渡す。undefined なら新規作成 */
  editTarget?: ScheduledPost;
  /** フォームが閉じられた / 保存されたときに呼ばれる */
  onClose: () => void;
  onSaved: (post: ScheduledPost) => void;
}

export default function ScheduleForm({ editTarget, onClose, onSaved }: ScheduleFormProps) {
  const isEdit = !!editTarget;

  const defaultDate = toLocalDateValue(
    editTarget?.scheduledAt ?? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  );
  const defaultTime = isEdit ? toLocalTimeValue(editTarget!.scheduledAt) : "21:00";

  const [content, setContent] = useState(editTarget?.content ?? "");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // editTarget が変わったらフォームをリセット
  useEffect(() => {
    setContent(editTarget?.content ?? "");
    setDate(
      editTarget ? toLocalDateValue(editTarget.scheduledAt)
        : toLocalDateValue(new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString())
    );
    setTime(editTarget ? toLocalTimeValue(editTarget.scheduledAt) : "21:00");
    setError(null);
  }, [editTarget]);

  const handleSubmit = async () => {
    if (!content.trim() || !date || !time) return;
    setLoading(true);
    setError(null);

    try {
      const scheduledAt = toISOString(date, time);
      const url = isEdit
        ? `/api/scheduled-posts/${editTarget!.id}`
        : "/api/scheduled-posts";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, scheduledAt }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error ?? `HTTP ${res.status}`);
      }

      const saved: ScheduledPost = await res.json();
      onSaved(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(155,89,245,0.18)",
        boxShadow: "0 0 30px rgba(155,89,245,0.06)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarClock size={15} className="text-purple-400" />
          <h3 className="text-sm font-semibold text-white">
            {isEdit ? "投稿を編集" : "新規予約投稿"}
          </h3>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 text-xs transition-colors">
          ✕
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs text-slate-500">投稿内容</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="投稿内容を入力..."
          rows={6}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <p className={`text-xs text-right ${content.length > 140 ? "text-yellow-400" : "text-slate-500"}`}>
          {content.length} / 280
        </p>
      </div>

      {/* Date / Time */}
      <div className="flex flex-col gap-3">
        <label className="text-xs text-slate-500">投稿日時</label>
        <div className="grid grid-cols-2 gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              colorScheme: "dark",
            }}
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-purple-500/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              colorScheme: "dark",
            }}
          />
        </div>

        {/* Best time chips */}
        <div className="grid grid-cols-2 gap-2">
          {BEST_TIMES.map((t) => (
            <button
              key={t.value}
              onClick={() => setTime(t.value)}
              className="flex flex-col items-start px-3 py-2 rounded-xl text-left transition-all hover:border-purple-500/30 hover:bg-purple-500/5"
              style={{
                background: time === t.value ? "rgba(155,89,245,0.1)" : "rgba(255,255,255,0.02)",
                border: time === t.value ? "1px solid rgba(155,89,245,0.3)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-xs font-medium text-slate-300">{t.label}</span>
              <span className="text-[10px] text-slate-500">{t.note}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-xs text-red-400 px-1">{error}</p>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!content.trim() || loading}
        className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #9b59f5, #4f8ef7)",
          color: "white",
          boxShadow: "0 0 16px rgba(155,89,245,0.3)",
        }}
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {loading ? "保存中..." : isEdit ? "更新する" : "予約する"}
      </button>
    </div>
  );
}
