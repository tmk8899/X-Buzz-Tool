"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import GenerateForm from "@/components/generate/GenerateForm";
import GeneratedPostCard from "@/components/generate/GeneratedPostCard";
import type { GeneratePostInput, GeneratedPostResult } from "@/types/generate";

const DEFAULT_INPUT: GeneratePostInput = {
  topic: "",
  target: "副業に興味があるエンジニア（20〜30代）",
  purpose: "フォロワー増加",
  tone: "casual",
  maxChars: 140,
  hasCta: true,
};

export default function GeneratePage() {
  const [input, setInput] = useState<GeneratePostInput>(DEFAULT_INPUT);
  const [results, setResults] = useState<GeneratedPostResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (partial: Partial<GeneratePostInput>) => {
    setInput((prev) => ({ ...prev, ...partial }));
  };

  const handleGenerate = async () => {
    if (!input.topic.trim()) return;
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? `HTTP ${res.status}`);
      }

      const data = await res.json();
      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="AI投稿生成"
        description="テーマ・ターゲット・目的を入力してバズる投稿を3パターン自動生成"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-6 items-start">
        {/* Form */}
        <GenerateForm
          input={input}
          loading={loading}
          onChange={handleChange}
          onSubmit={handleGenerate}
        />

        {/* Results */}
        <div className="flex flex-col gap-4">
          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm text-red-400"
              style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
            >
              {error}
            </div>
          )}

          {loading && (
            <div className="flex flex-col gap-4">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-2xl h-52 animate-pulse"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(79,142,247,0.08)" }}
                />
              ))}
            </div>
          )}

          {!loading && results.length === 0 && !error && (
            <div
              className="rounded-2xl p-12 flex flex-col items-center gap-4 text-center"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{ background: "rgba(79,142,247,0.08)", border: "1px solid rgba(79,142,247,0.12)" }}
              >
                <Sparkles size={24} className="text-blue-400/50" />
              </div>
              <p className="text-slate-500 text-sm">
                左のフォームに入力して「3パターン生成する」を押してください
              </p>
            </div>
          )}

          {!loading && results.map((r, i) => (
            <GeneratedPostCard key={i} result={r} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
