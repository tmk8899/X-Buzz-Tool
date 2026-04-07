"use client";

const GOALS = [
  { id: "viral", label: "バズらせる", emoji: "🔥" },
  { id: "concise", label: "簡潔にする", emoji: "✂️" },
  { id: "engaging", label: "エンゲージ強化", emoji: "💬" },
  { id: "formal", label: "フォーマルに", emoji: "👔" },
  { id: "casual", label: "カジュアルに", emoji: "😊" },
  { id: "hook", label: "書き出し強化", emoji: "🎯" },
];

interface RewriteInputProps {
  original: string;
  goal: string;
  onOriginalChange: (v: string) => void;
  onGoalChange: (v: string) => void;
}

export default function RewriteInput({
  original,
  goal,
  onOriginalChange,
  onGoalChange,
}: RewriteInputProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">元の投稿</label>
        <textarea
          value={original}
          onChange={(e) => onOriginalChange(e.target.value)}
          placeholder="リライトしたい投稿を貼り付けてください..."
          rows={7}
          className="w-full rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 resize-none outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        />
        <p className={`text-xs text-right ${original.length > 140 ? "text-yellow-400" : "text-slate-500"}`}>
          {original.length} 文字
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-slate-300">リライトの目的</label>
        <div className="grid grid-cols-3 gap-2">
          {GOALS.map((g) => (
            <button
              key={g.id}
              onClick={() => onGoalChange(g.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={
                goal === g.id
                  ? {
                      background: "rgba(79,142,247,0.15)",
                      border: "1px solid rgba(79,142,247,0.4)",
                      color: "#7aa8f7",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#94a3b8",
                    }
              }
            >
              <span>{g.emoji}</span>
              <span className="font-medium text-xs">{g.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
