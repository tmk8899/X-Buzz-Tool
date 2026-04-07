"use client";

import { CalendarClock } from "lucide-react";

const BEST_TIMES = [
  { label: "朝 7:00", value: "07:00", note: "通勤時間帯" },
  { label: "昼 12:30", value: "12:30", note: "ランチタイム" },
  { label: "夜 21:00", value: "21:00", note: "最高エンゲージ" },
  { label: "深夜 23:00", value: "23:00", note: "夜活層向け" },
];

interface ScheduleTimePickerProps {
  date: string;
  time: string;
  onDateChange: (v: string) => void;
  onTimeChange: (v: string) => void;
}

export default function ScheduleTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: ScheduleTimePickerProps) {
  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
        <CalendarClock size={14} className="text-blue-400" />
        投稿日時
      </label>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">日付</span>
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              colorScheme: "dark",
            }}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-xs text-slate-500">時刻</span>
          <input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            className="rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              colorScheme: "dark",
            }}
          />
        </div>
      </div>

      {/* Best time suggestions */}
      <div>
        <p className="text-xs text-slate-500 mb-2">おすすめ時間帯</p>
        <div className="grid grid-cols-2 gap-2">
          {BEST_TIMES.map((t) => (
            <button
              key={t.value}
              onClick={() => onTimeChange(t.value)}
              className="flex flex-col items-start px-3 py-2 rounded-xl text-left transition-all hover:border-blue-500/30 hover:bg-blue-500/5"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span className="text-xs font-medium text-slate-300">{t.label}</span>
              <span className="text-[10px] text-slate-500">{t.note}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
