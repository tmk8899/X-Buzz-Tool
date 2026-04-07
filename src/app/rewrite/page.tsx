"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import RewriteInput from "@/components/rewrite/RewriteInput";
import RewriteResult from "@/components/rewrite/RewriteResult";

const DUMMY_REWRITE = `【たった1つの習慣で月収が2倍になった話】

フリーランス2年目の自分が実践した方法を公開します。

複雑なことは何もしていない。
毎朝30分、「自分の実績」を言語化するだけ。

これを続けたら勝手に仕事が来るようになった。

スキルより「見え方」の時代。
発信しないのは存在しないのと同じです。`;

export default function RewritePage() {
  const [original, setOriginal] = useState("");
  const [goal, setGoal] = useState("viral");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRewrite = async () => {
    if (!original.trim()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setResult(DUMMY_REWRITE);
    setLoading(false);
  };

  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="リライト"
        description="既存の投稿をAIで改善・バズ仕様に書き直し"
      />

      <div className="flex flex-col gap-6">
        <div
          className="rounded-2xl p-6 flex flex-col gap-5"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(79,142,247,0.12)",
          }}
        >
          <RewriteInput
            original={original}
            goal={goal}
            onOriginalChange={setOriginal}
            onGoalChange={setGoal}
          />

          <button
            onClick={handleRewrite}
            disabled={!original.trim() || loading}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
              color: "white",
              boxShadow: "0 0 20px rgba(79,142,247,0.3)",
            }}
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {loading ? "リライト中..." : "リライトする"}
          </button>
        </div>

        {result && (
          <RewriteResult original={original} rewritten={result} />
        )}
      </div>
    </div>
  );
}
