"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import MemoCard from "@/components/notebook/MemoCard";
import MemoEditor from "@/components/notebook/MemoEditor";
import { dummyMemos } from "@/lib/dummy-data";
import type { Memo } from "@/types";

export default function NotebookPage() {
  const [selected, setSelected] = useState<Memo | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="ノートブック"
        description="バズ投稿のノウハウや分析を蓄積"
        actions={
          <button
            onClick={() => { setSelected(null); setShowEditor(true); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #9b59f5, #4f8ef7)",
              color: "white",
              boxShadow: "0 0 16px rgba(155,89,245,0.3)",
            }}
          >
            <Plus size={15} />
            新規メモ
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyMemos.map((memo) => (
            <MemoCard
              key={memo.id}
              memo={memo}
              onClick={() => { setSelected(memo); setShowEditor(true); }}
            />
          ))}
        </div>

        {showEditor && (
          <MemoEditor memo={selected} onClose={() => setShowEditor(false)} />
        )}
      </div>
    </div>
  );
}
