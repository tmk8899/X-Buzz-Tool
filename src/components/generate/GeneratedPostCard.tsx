"use client";

import { Copy, Check, CalendarClock, Hash, Zap, BookOpen, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import type { GeneratedPostResult } from "@/types/generate";
import NeonBadge from "@/components/ui/NeonBadge";

interface GeneratedPostCardProps {
  result: GeneratedPostResult;
  index: number;
}

export default function GeneratedPostCard({ result, index }: GeneratedPostCardProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);
  const [postError, setPostError] = useState<string | null>(null);

  const handlePost = async () => {
    const stored = localStorage.getItem("xAccountConfig");
    if (!stored) { setPostError("設定ページでXアカウントを設定してください"); return; }
    const creds = JSON.parse(stored);
    if (!creds.apiKey) { setPostError("APIキーが設定されていません"); return; }

    const text = [result.hook, result.body, result.cta].filter(Boolean).join("\n\n");
    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch("/api/x/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creds, text }),
      });
      const data = await res.json();
      if (data.error) { setPostError(data.error); } else { setPosted(true); }
    } catch { setPostError("投稿に失敗しました"); }
    finally { setPosting(false); }
  };

  const handleCopy = async () => {
    const text = [result.hook, result.body, result.cta]
      .filter(Boolean)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const charCount = result.full_post.length;

  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(79,142,247,0.15)",
        boxShadow: "0 0 20px rgba(79,142,247,0.06)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex items-center gap-2">
          <span
            className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(79,142,247,0.15)", color: "#7aa8f7" }}
          >
            案 {index + 1}
          </span>
          <span className="text-sm font-semibold text-white truncate max-w-[200px]">
            {result.title}
          </span>
        </div>
        <span className={`text-xs ${charCount > 140 ? "text-yellow-400" : "text-slate-500"}`}>
          {charCount} 文字
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4 flex flex-col gap-3">
        {/* Hook */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <Zap size={11} className="text-yellow-400" />
            <span className="text-[10px] font-semibold text-yellow-400/80 uppercase tracking-wider">Hook</span>
          </div>
          <p className="text-sm text-white leading-relaxed font-medium whitespace-pre-line">{result.hook}</p>
        </div>

        {/* Body */}
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen size={11} className="text-blue-400" />
            <span className="text-[10px] font-semibold text-blue-400/80 uppercase tracking-wider">本文</span>
          </div>
          <p className={`text-sm text-slate-300 leading-relaxed whitespace-pre-line ${!expanded ? "line-clamp-4" : ""}`}>
            {result.body}
          </p>
          {result.body.split("\n").length > 4 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs text-blue-400 hover:text-blue-300 mt-1 transition-colors"
            >
              {expanded ? "折りたたむ ▲" : "続きを見る ▼"}
            </button>
          )}
        </div>

        {/* CTA */}
        {result.cta && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-wider">CTA</span>
            </div>
            <p className="text-sm text-emerald-300 leading-relaxed whitespace-pre-line">{result.cta}</p>
          </div>
        )}

        {/* Hashtags */}
        {result.hashtags.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <Hash size={12} className="text-slate-500" />
            {result.hashtags.map((tag) => (
              <NeonBadge key={tag} color="purple">#{tag}</NeonBadge>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div
        className="px-5 py-3 flex gap-2"
        style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8",
          }}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? "コピー済み" : "コピー"}
        </button>
        <button
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80"
          style={{
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.25)",
            color: "#7aa8f7",
          }}
        >
          <CalendarClock size={12} />
          予約投稿へ
        </button>
        <button
          onClick={handlePost}
          disabled={posting || posted}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80 ml-auto disabled:opacity-50"
          style={
            posted
              ? { background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)", color: "#34d399" }
              : { background: "rgba(29,161,242,0.1)", border: "1px solid rgba(29,161,242,0.3)", color: "#38bdf8" }
          }
        >
          {posting ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
          {posted ? "投稿済み！" : posting ? "投稿中..." : "Xに投稿"}
        </button>
        {postError && (
          <p className="w-full text-[10px] text-red-400 mt-1">{postError}</p>
        )}
      </div>
    </div>
  );
}
