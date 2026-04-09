import StatsRow from "@/components/dashboard/StatsRow";
import RecentPosts from "@/components/dashboard/RecentPosts";
import QuickActions from "@/components/dashboard/QuickActions";
import PageHeader from "@/components/layout/PageHeader";
import AlertBanner from "@/components/layout/AlertBanner";
import { dummyStats, dummyPosts } from "@/lib/dummy-data";

export default function DashboardPage() {
  return (
    <div className="min-h-full p-4 lg:p-8">
      {/* Title */}
      <PageHeader
        title="ダッシュボード"
        description="今週の投稿パフォーマンスと概要"
      />

      {/* Alert banner */}
      <AlertBanner
        message="今週は12件投稿済み。最高インプレッション投稿は 22,400 views を記録しました🎉"
        cta={{ label: "投稿を生成する", href: "/generate" }}
      />

      {/* KPI stats */}
      <div className="mb-8">
        <StatsRow stats={dummyStats} />
      </div>

      {/* Main grid: posts (left) + quick actions (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <RecentPosts posts={dummyPosts} />
        <QuickActions />
      </div>
    </div>
  );
}
