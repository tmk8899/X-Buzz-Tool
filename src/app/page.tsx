"use client";

import { useState, useEffect } from "react";
import StatsRow from "@/components/dashboard/StatsRow";
import RecentPosts from "@/components/dashboard/RecentPosts";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/layout/PageHeader";
import AlertBanner from "@/components/layout/AlertBanner";
import { dummyStats, dummyPosts } from "@/lib/dummy-data";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>(dummyStats);
  const [xUser, setXUser] = useState<{ name: string; username: string } | null>(null);
  const [xError, setXError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("xAccountConfig");
    if (!stored) return;
    try {
      const creds = JSON.parse(stored);
      if (!creds.apiKey || !creds.accessToken) return;

      fetch("/api/x/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      })
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
    } catch {}
  }, []);

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

      {!xUser && !xError && (
        <AlertBanner
          message="今週は12件投稿済み。最高インプレッション投稿は 22,400 views を記録しました🎉"
          cta={{ label: "投稿を生成する", href: "/generate" }}
        />
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
