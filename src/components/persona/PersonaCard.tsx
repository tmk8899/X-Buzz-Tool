import { CheckCircle2, Circle } from "lucide-react";
import type { Character } from "@/types";
import NeonBadge from "@/components/ui/NeonBadge";

interface PersonaCardProps {
  character: Character;
  onSelect: () => void;
  onEdit: () => void;
}

export default function PersonaCard({ character, onSelect, onEdit }: PersonaCardProps) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: character.isActive
          ? "1px solid rgba(79,142,247,0.35)"
          : "1px solid rgba(255,255,255,0.06)",
        boxShadow: character.isActive ? "0 0 28px rgba(79,142,247,0.1)" : "none",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
          style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.15)" }}
        >
          {character.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-semibold text-white truncate">{character.name}</p>
            {character.isActive
              ? <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
              : <Circle size={14} className="text-slate-600 shrink-0" />}
          </div>
          <p className="text-xs text-slate-400 mt-0.5 truncate">{character.description}</p>
        </div>
        <NeonBadge color={character.isActive ? "blue" : "purple"}>
          {character.isActive ? "使用中" : "待機中"}
        </NeonBadge>
      </div>

      {/* Tone */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p className="text-[10px] text-slate-500 mb-1">トーン・スタイル</p>
        <p className="text-xs text-slate-300 leading-relaxed">{character.tone}</p>
      </div>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5">
        {character.topics.map((t) => (
          <NeonBadge key={t} color="cyan">{t}</NeonBadge>
        ))}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-1">
        {!character.isActive && (
          <button
            onClick={onSelect}
            className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
              color: "white",
              boxShadow: "0 0 12px rgba(79,142,247,0.25)",
            }}
          >
            このペルソナを使用
          </button>
        )}
        <button
          onClick={onEdit}
          className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
        >
          編集
        </button>
      </div>
    </div>
  );
}
