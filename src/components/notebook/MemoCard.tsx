import { BookOpen, Tag } from "lucide-react";
import type { Memo } from "@/types";
import NeonBadge from "@/components/ui/NeonBadge";

interface MemoCardProps {
  memo: Memo;
  onClick?: () => void;
}

export default function MemoCard({ memo, onClick }: MemoCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-2xl p-5 flex flex-col gap-3 w-full transition-all duration-150 hover:border-purple-500/25 hover:scale-[1.01]"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "rgba(155,89,245,0.1)", border: "1px solid rgba(155,89,245,0.2)" }}
        >
          <BookOpen size={15} className="text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white text-sm truncate">{memo.title}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {new Date(memo.updatedAt).toLocaleDateString("ja-JP")} 更新
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 whitespace-pre-line">
        {memo.content}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {memo.tags.map((tag) => (
          <NeonBadge key={tag} color="purple">
            <Tag size={9} className="mr-1" />
            {tag}
          </NeonBadge>
        ))}
      </div>
    </button>
  );
}
