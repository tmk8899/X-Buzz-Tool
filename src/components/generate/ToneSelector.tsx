"use client";

const TONES = [
  { id: "casual", label: "カジュアル", emoji: "😊" },
  { id: "expert", label: "専門家", emoji: "🧑‍💻" },
  { id: "story", label: "ストーリー", emoji: "📖" },
  { id: "list", label: "リスト型", emoji: "📋" },
  { id: "question", label: "問いかけ", emoji: "🤔" },
  { id: "shock", label: "インパクト", emoji: "⚡" },
];

interface ToneSelectorProps {
  value: string;
  onChange: (v: string) => void;
}

export default function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-slate-300">投稿スタイル</label>
      <div className="grid grid-cols-3 gap-2">
        {TONES.map((tone) => {
          const active = value === tone.id;
          return (
            <button
              key={tone.id}
              onClick={() => onChange(tone.id)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={
                active
                  ? {
                      background: "rgba(79,142,247,0.15)",
                      border: "1px solid rgba(79,142,247,0.4)",
                      color: "#7aa8f7",
                      boxShadow: "0 0 12px rgba(79,142,247,0.15)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      color: "#94a3b8",
                    }
              }
            >
              <span>{tone.emoji}</span>
              <span className="font-medium">{tone.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
