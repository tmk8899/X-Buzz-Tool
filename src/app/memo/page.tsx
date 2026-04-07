import PageHeader from "@/components/layout/PageHeader";
import NeonBadge from "@/components/ui/NeonBadge";
import { dummyMemos } from "@/lib/dummy-data";
import { BookOpen } from "lucide-react";

export default function MemoPage() {
  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="学習メモ"
        description="バズ投稿のノウハウを蓄積します"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dummyMemos.map((memo) => (
          <div
            key={memo.id}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-start gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(155,89,245,0.1)", border: "1px solid rgba(155,89,245,0.2)" }}
              >
                <BookOpen size={15} className="text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white text-sm">{memo.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(memo.updatedAt).toLocaleDateString("ja-JP")} 更新
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed line-clamp-4 whitespace-pre-line">
              {memo.content}
            </p>

            <div className="flex flex-wrap gap-1.5">
              {memo.tags.map((tag) => (
                <NeonBadge key={tag} color="purple">{tag}</NeonBadge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
