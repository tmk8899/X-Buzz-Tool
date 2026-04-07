import {
  Sparkles,
  UserCircle2,
  CalendarClock,
  BarChart2,
  BookOpen,
  RefreshCw,
  Zap,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import GuideCard from "@/components/guide/GuideCard";
import GuideSection from "@/components/guide/GuideSection";

export default function GuidePage() {
  return (
    <div className="min-h-full p-8">
      <PageHeader
        title="使い方ガイド"
        description="X Buzz Tool を最大限活用するための手順"
      />

      {/* Hero */}
      <div
        className="rounded-2xl px-6 py-8 mb-8 text-center"
        style={{
          background: "linear-gradient(135deg, rgba(79,142,247,0.1), rgba(155,89,245,0.08))",
          border: "1px solid rgba(79,142,247,0.2)",
          boxShadow: "0 0 40px rgba(79,142,247,0.08)",
        }}
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
            boxShadow: "0 0 24px rgba(79,142,247,0.4)",
          }}
        >
          <Zap size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">X Buzz Tool へようこそ</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          AIを活用してXでバズる投稿を量産・管理するためのオールインワンツールです。
          以下のステップで始めましょう。
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GuideSection title="基本の流れ">
          <GuideCard
            step={1}
            title="ペルソナを設定する"
            description="「ペルソナ設定」ページで投稿キャラクターのトーン・テーマを決めます。AIが一貫したスタイルで投稿を生成します。"
            icon={UserCircle2}
            color="#4f8ef7"
            bgColor="rgba(79,142,247,0.05)"
            borderColor="rgba(79,142,247,0.12)"
          />
          <GuideCard
            step={2}
            title="AI投稿を生成する"
            description="「AI投稿生成」ページでテーマを入力し、スタイルを選んでボタンを押すだけで3パターンの投稿が自動生成されます。"
            icon={Sparkles}
            color="#9b59f5"
            bgColor="rgba(155,89,245,0.05)"
            borderColor="rgba(155,89,245,0.12)"
          />
          <GuideCard
            step={3}
            title="予約投稿をセットする"
            description="生成した投稿を「予約投稿」ページでスケジュール設定。最適な時間帯に自動投稿されます（X API連携後）。"
            icon={CalendarClock}
            color="#00d4ff"
            bgColor="rgba(0,212,255,0.05)"
            borderColor="rgba(0,212,255,0.12)"
          />
        </GuideSection>

        <GuideSection title="活用テクニック">
          <GuideCard
            step={4}
            title="投稿履歴でPDCAを回す"
            description="「投稿履歴」ページでインプレッション・いいね数を確認。バズった投稿のパターンを分析してペルソナを改善します。"
            icon={BarChart2}
            color="#f472b6"
            bgColor="rgba(244,114,182,0.05)"
            borderColor="rgba(244,114,182,0.12)"
          />
          <GuideCard
            step={5}
            title="ノートブックにノウハウを蓄積"
            description="バズったフォーマット・最適投稿時間・競合分析などをノートブックに記録。AIへの指示が精度アップします。"
            icon={BookOpen}
            color="#34d399"
            bgColor="rgba(52,211,153,0.05)"
            borderColor="rgba(52,211,153,0.12)"
          />
          <GuideCard
            step={6}
            title="リライトで過去投稿を再活用"
            description="反応がいまひとつだった投稿を「リライト」ページでAI改善。バズ要素を追加してセカンドチャンスを狙います。"
            icon={RefreshCw}
            color="#fb923c"
            bgColor="rgba(251,146,60,0.05)"
            borderColor="rgba(251,146,60,0.12)"
          />
        </GuideSection>
      </div>

      {/* CTA */}
      <div
        className="mt-8 rounded-2xl p-6 flex items-center justify-between gap-4"
        style={{
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div>
          <p className="text-white font-semibold text-sm">さっそく始めましょう</p>
          <p className="text-slate-500 text-xs mt-0.5">まずはペルソナ設定から</p>
        </div>
        <a
          href="/persona"
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90 shrink-0"
          style={{
            background: "linear-gradient(135deg, #4f8ef7, #9b59f5)",
            color: "white",
            boxShadow: "0 0 16px rgba(79,142,247,0.3)",
          }}
        >
          <UserCircle2 size={14} />
          ペルソナを設定する
        </a>
      </div>
    </div>
  );
}
