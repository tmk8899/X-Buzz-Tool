"use client";

import { Copy, Check, ArrowRight } from "lucide-react";
import { useState } from "react";

interface RewriteResultProps {
  original: string;
  rewritten: string;
}

export default function RewriteResult({ original, rewritten }: RewriteResultProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(rewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 items-center">
        {/* Before */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Before</p>
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-line">{original}</p>
        </div>

        <ArrowRight size={16} className="text-blue-400 mx-auto" />

        {/* After */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-2"
          style={{
            background: "rgba(79,142,247,0.05)",
            border: "1px solid rgba(79,142,247,0.2)",
            boxShadow: "0 0 20px rgba(79,142,247,0.08)",
          }}
        >
          <p className="text-[10px] text-blue-400/70 font-medium uppercase tracking-wider">After</p>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-line">{rewritten}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all hover:opacity-80"
          style={{
            background: "rgba(79,142,247,0.1)",
            border: "1px solid rgba(79,142,247,0.25)",
            color: "#7aa8f7",
          }}
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          {copied ? "コピー済み" : "コピー"}
        </button>
      </div>
    </div>
  );
}
