"use client";

import { useState } from "react";
import { RefreshCw, Loader2 } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import RewriteInput from "@/components/rewrite/RewriteInput";
import RewriteResult from "@/components/rewrite/RewriteResult";

export default function RewritePage() {
  const [original, setOriginal] = useState("");
  const [goal, setGoal] = useState("viral");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    if (!original.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ original, goal }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data.rewritten);
    } catch (err) {
      setError(err instanceof Error ? err.message : "リライトに失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-4 lg:p-8">
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

          {error && (
            <p className="text-sm text-red-400 px-3 py-2 rounded-xl"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}>
              {error}
            </p>
          )}

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
