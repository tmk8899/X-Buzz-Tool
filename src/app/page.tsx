"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import StatsRow from "@/components/dashboard/StatsRow";
import RecentPosts from "@/components/dashboard/RecentPosts";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/layout/PageHeader";
import { dummyStats, dummyPosts } from "@/lib/dummy-data";
import type { DashboardStats } from "@/types";

interface SetupItem {
  label: string;
  done: boolean;
  href: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(dummyStats);
  const [xUser, setXUser] = useState<{ name: string; username: string } | null>(null);
  const [xError, setXError] = useState<string | null>(null);
  const [setupItems, setSetupItems] = useState<SetupItem[]>([]);

  // X API取得
  useEffect(() => {
    fetch("/api/x/user")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setXError(data.error); return; }
        setXUser({ name: data.name, username: data.username });
        setStats((prev) => ({
          ...prev,
          totalFollowers: data.followers,
          totalPosts: data.tweetCount,
        }));
      })
      .catch(() => setXError("X APIとの通信に失敗しました"));
  }, []);

  // セットアップ状況チェック（localStorage）
  useEffect(() => {
    const hasPersona = !!localStorage.getItem("activePersona");
    const hasXConfig = !!localStorage.getItem("xAccountConfig");
    setSetupItems([
      { label: "ペルソナを設定する", done: hasPersona, href: "/persona" },
      { label: "X APIを連携する", done: hasXConfig || !!xUser, href: "/persona" },
      { label: "AI投稿を生成してみる", done: false, href: "/generate" },
    ]);
  }, [xUser]);

  const allDone = setupItems.length > 0 && setupItems.every((i) => i.done);

  return (
    <div className="min-h-full p-4 lg:p-8">
      <PageHeader
        title="ダッシュボード"
        description={xUser ? `@${xUser.username} のパフォーマンス概要` : "今週の投稿パフォーマンスと概要"}
      />

      {xError && (
        <div
          className="rounded-xl px-4 py-3 text-sm text-red-400 mb-4"
          style={{ background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)" }}
        >
          X API エラー：{xError}
        </div>
      )}

      {/* セットアップチェックリスト */}
      {!allDone && setupItems.length > 0 && (
        <div
          className="rounded-2xl p-5 mb-6"
          style={{
            background: "rgba(79,142,247,0.06)",
            border: "1px solid rgba(79,142,247,0.18)",
          }}
        >
          <p className="text-sm font-semibold text-white mb-3">🚀 セットアップ</p>
          <div className="flex flex-col gap-2">
            {setupItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-3 py-1.5 group transition-opacity hover:opacity-80"
              >
                {item.done ? (
                  <CheckCircle2 size={17} className="text-emerald-400 shrink-0" />
                ) : (
                  <Circle size={17} className="text-slate-600 shrink-0" />
                )}
                <span
                  className={`text-sm ${item.done ? "line-through text-slate-500" : "text-slate-200"}`}
                >
                  {item.label}
                </span>
                {!item.done && (
                  <span className="ml-auto text-xs text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    設定する →
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mb-8">
        <StatsRow stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <RecentPosts posts={dummyPosts} />
        <QuickActions />
      </div>
    </div>
  );
}
