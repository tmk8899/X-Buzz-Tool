"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react";

interface AlertBannerProps {
  message: string;
  cta?: { label: string; href: string };
}

export default function AlertBanner({ message, cta }: AlertBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      className="rounded-2xl px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8"
      style={{
        background: "linear-gradient(135deg, rgba(79,142,247,0.12), rgba(155,89,245,0.10))",
        border: "1px solid rgba(79,142,247,0.25)",
        boxShadow: "0 0 30px rgba(79,142,247,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: "rgba(79,142,247,0.2)" }}
      >
        <Sparkles size={15} className="text-blue-400" />
      </div>

      <p className="flex-1 text-sm text-slate-300">{message}</p>

      {cta && (
        <a
          href={cta.href}
          className="shrink-0 text-xs font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-90 self-start sm:self-auto"
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
            color: "white",
            boxShadow: "0 0 12px rgba(79,142,247,0.4)",
          }}
        >
          {cta.label}
        </a>
      )}

      <button
        onClick={() => setDismissed(true)}
        className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors ml-1"
      >
        <X size={15} />
      </button>
    </div>
  );
}
