import PageHeader from "@/components/layout/PageHeader";
import NeonBadge from "@/components/ui/NeonBadge";
import { dummyCharacters } from "@/lib/dummy-data";
import { CheckCircle2 } from "lucide-react";

export default function CharacterPage() {
  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="キャラ設定"
        description="投稿スタイルとトーンを管理します"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {dummyCharacters.map((char) => (
          <div
            key={char.id}
            className="rounded-2xl p-6 flex flex-col gap-4"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: char.isActive
                ? "1px solid rgba(79,142,247,0.3)"
                : "1px solid rgba(255,255,255,0.06)",
              boxShadow: char.isActive ? "0 0 24px rgba(79,142,247,0.1)" : "none",
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: "rgba(79,142,247,0.1)" }}
              >
                {char.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{char.name}</p>
                  {char.isActive && (
                    <CheckCircle2 size={14} className="text-blue-400" />
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{char.description}</p>
              </div>
              <NeonBadge color={char.isActive ? "blue" : "purple"}>
                {char.isActive ? "使用中" : "待機中"}
              </NeonBadge>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1.5">トーン</p>
              <p className="text-sm text-slate-300">{char.tone}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-2">トピック</p>
              <div className="flex flex-wrap gap-2">
                {char.topics.map((t) => (
                  <NeonBadge key={t} color="cyan">{t}</NeonBadge>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
