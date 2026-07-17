"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import {
  drawGacha,
  buildVideoPrompt,
  CAPSULE_META,
  GODDESS_META,
  type CapsuleColor,
  type GachaResult,
} from "@/lib/gacha";

type Phase = "idle" | "climb" | "spin" | "open" | "reveal";

const PHASE_LABEL: Record<Exclude<Phase, "idle" | "reveal">, string> = {
  climb: "① 真紅の大階段を駆け上がる…",
  spin: "② ハンドルを回してガチャを引く…",
  open: "③ カプセルが眩い光とともに開く…",
};

export default function GachaPage() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<GachaResult | null>(null);
  const [counts, setCounts] = useState<Record<CapsuleColor, number>>({
    gold: 0,
    silver: 0,
    bronze: 0,
    rainbow: 0,
  });
  const [copied, setCopied] = useState<"ja" | "en" | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  const handlePull = () => {
    const drawn = drawGacha();
    setResult(drawn);
    setCopied(null);
    setPhase("climb");
    // 各カット1秒ずつ演出してから結果を公開する
    timers.current.push(
      setTimeout(() => setPhase("spin"), 1000),
      setTimeout(() => setPhase("open"), 2000),
      setTimeout(() => {
        setPhase("reveal");
        setCounts((prev) => ({
          ...prev,
          [drawn.capsule]: prev[drawn.capsule] + 1,
        }));
      }, 3000),
    );
  };

  const handleCopy = async (lang: "ja" | "en") => {
    if (!result) return;
    await navigator.clipboard.writeText(buildVideoPrompt(result)[lang]);
    setCopied(lang);
    timers.current.push(setTimeout(() => setCopied(null), 2000));
  };

  const isPulling = phase === "climb" || phase === "spin" || phase === "open";
  const capsule = result ? CAPSULE_META[result.capsule] : null;
  const goddess = result ? GODDESS_META[result.goddess] : null;
  const prompt = result ? buildVideoPrompt(result) : null;
  const totalPulls = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-full p-4 lg:p-8">
      <style>{`
        @keyframes gachaClimb { from { transform: translateY(60%); } to { transform: translateY(-10%); } }
        @keyframes gachaSpin { from { transform: rotate(0deg); } to { transform: rotate(720deg); } }
        @keyframes gachaGlow { 0% { opacity: 0; transform: scale(0.4); } 60% { opacity: 1; transform: scale(1.15); } 100% { opacity: 0.9; transform: scale(1); } }
        @keyframes gachaDrop { 0% { opacity: 0; transform: translateY(-48px); } 70% { opacity: 1; transform: translateY(4px); } 100% { opacity: 1; transform: translateY(0); } }
      `}</style>

      <PageHeader
        title="女神ガチャ"
        description="4秒ショート映像のシナリオを抽選し、映像生成AI用プロンプトを出力"
      />

      <div className="flex flex-col gap-6 max-w-2xl">
        {/* ステージ */}
        <div
          className="rounded-2xl p-6 flex flex-col items-center justify-center gap-4 overflow-hidden"
          style={{
            minHeight: 280,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(79,142,247,0.12)",
          }}
        >
          {phase === "idle" && (
            <>
              <div className="text-6xl">🎰</div>
              <p className="text-sm text-slate-400 text-center">
                真紅のカーペットが敷かれた30段の大階段。
                <br />
                その頂上に、巨大なガチャガチャが待っている——
              </p>
            </>
          )}

          {phase === "climb" && (
            <div
              className="flex flex-col items-center gap-1"
              style={{ animation: "gachaClimb 1s ease-in forwards" }}
            >
              <div className="text-5xl">🎰</div>
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-sm"
                  style={{
                    height: 8,
                    width: 90 + i * 14,
                    background: "linear-gradient(180deg, #b91c1c, #7f1d1d)",
                  }}
                />
              ))}
            </div>
          )}

          {phase === "spin" && (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold text-white"
              style={{
                animation: "gachaSpin 1s ease-in-out forwards",
                background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
                boxShadow: "0 0 30px rgba(79,142,247,0.5)",
              }}
            >
              ◎
            </div>
          )}

          {phase === "open" && capsule && (
            <div
              className="w-24 h-24 rounded-full"
              style={{
                animation: "gachaGlow 1s ease-out forwards",
                background: capsule.gradient,
                boxShadow: `0 0 80px 30px ${capsule.glow}`,
              }}
            />
          )}

          {isPulling && (
            <p className="text-sm font-medium text-slate-300">
              {PHASE_LABEL[phase as keyof typeof PHASE_LABEL]}
            </p>
          )}

          {phase === "reveal" && capsule && goddess && (
            <div
              className="flex flex-col items-center gap-4"
              style={{ animation: "gachaDrop 0.6s ease-out forwards" }}
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-black/80"
                  style={{ background: capsule.gradient }}
                >
                  {capsule.label}カプセル（{capsule.rate}）
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    color: goddess.color,
                    border: `1px solid ${goddess.color}`,
                    background: "rgba(255,255,255,0.04)",
                  }}
                >
                  {goddess.label}（{goddess.rate}）
                </span>
              </div>
              {/* 丸い台座の上の女神 */}
              <div className="flex flex-col items-center">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
                  style={{
                    background: `radial-gradient(circle at 35% 30%, ${goddess.color}, transparent 75%), rgba(255,255,255,0.06)`,
                    boxShadow: `0 0 40px ${goddess.color}66`,
                  }}
                >
                  👸
                </div>
                <div
                  className="w-24 h-3 rounded-[50%] mt-1"
                  style={{ background: "rgba(255,255,255,0.12)" }}
                />
              </div>
              <p
                className="text-base font-semibold text-center"
                style={{ color: goddess.color }}
              >
                「{goddess.quote}」
              </p>
            </div>
          )}
        </div>

        {/* ガチャボタン */}
        <button
          onClick={handlePull}
          disabled={isPulling}
          className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90"
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
            color: "white",
            boxShadow: "0 0 20px rgba(79,142,247,0.3)",
          }}
        >
          <Sparkles size={15} />
          {isPulling
            ? "演出中..."
            : phase === "reveal"
              ? "もう一度ガチャを回す"
              : "ガチャを回す"}
        </button>

        {/* セッション統計 */}
        {totalPulls > 0 && (
          <div
            className="rounded-2xl p-4 flex items-center justify-between text-xs text-slate-400"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(79,142,247,0.12)",
            }}
          >
            <span>累計 {totalPulls} 回</span>
            <span className="flex gap-3">
              {(Object.keys(CAPSULE_META) as CapsuleColor[]).map((c) => (
                <span key={c}>
                  {CAPSULE_META[c].label} × {counts[c]}
                </span>
              ))}
            </span>
          </div>
        )}

        {/* 映像プロンプト出力 */}
        {phase === "reveal" && prompt && (
          <div className="flex flex-col gap-4">
            {(["ja", "en"] as const).map((lang) => (
              <div
                key={lang}
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(79,142,247,0.12)",
                }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">
                    {lang === "ja"
                      ? "映像プロンプト（日本語）"
                      : "Video Prompt (English / Veo・Sora向け)"}
                  </h3>
                  <button
                    onClick={() => handleCopy(lang)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white transition-all"
                    style={{
                      background: "rgba(79,142,247,0.1)",
                      border: "1px solid rgba(79,142,247,0.25)",
                    }}
                  >
                    {copied === lang ? <Check size={12} /> : <Copy size={12} />}
                    {copied === lang ? "コピー済み" : "コピー"}
                  </button>
                </div>
                <pre className="text-xs text-slate-400 whitespace-pre-wrap leading-relaxed font-sans">
                  {prompt[lang]}
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
