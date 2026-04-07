import type { Post, Character, Memo, DashboardStats, ActivityPoint } from "@/types";

export const dummyStats: DashboardStats = {
  totalPosts: 142,
  totalImpressions: 284500,
  totalLikes: 3820,
  totalFollowers: 2140,
  postsThisWeek: 12,
  impressionsGrowth: 18.4,
  likesGrowth: 12.7,
  followersGrowth: 5.2,
};

export const dummyActivity: ActivityPoint[] = [
  { date: "03/31", impressions: 8200, likes: 120, posts: 2 },
  { date: "04/01", impressions: 11400, likes: 180, posts: 3 },
  { date: "04/02", impressions: 9800, likes: 145, posts: 2 },
  { date: "04/03", impressions: 15600, likes: 240, posts: 4 },
  { date: "04/04", impressions: 13200, likes: 198, posts: 3 },
  { date: "04/05", impressions: 18900, likes: 310, posts: 5 },
  { date: "04/06", impressions: 22400, likes: 380, posts: 4 },
];

export const dummyPosts: Post[] = [
  {
    id: "1",
    content:
      "AIを活用したコンテンツ戦略で、フォロワーが3ヶ月で2倍になった方法を公開します。\n\n① ターゲット分析\n② コンテンツカレンダー作成\n③ A/Bテスト実施\n\n詳細はスレッドで👇",
    status: "published",
    publishedAt: "2026-04-06T09:00:00",
    likes: 380,
    retweets: 94,
    replies: 42,
    impressions: 22400,
    characterId: "1",
  },
  {
    id: "2",
    content:
      "プログラミング初心者が最初に覚えるべき3つの習慣\n\n1. 毎日30分コードを書く\n2. エラーメッセージを読む\n3. 公式ドキュメントを見る\n\n継続は力なり💪",
    status: "published",
    publishedAt: "2026-04-05T18:30:00",
    likes: 241,
    retweets: 67,
    replies: 28,
    impressions: 14200,
    characterId: "1",
  },
  {
    id: "3",
    content:
      "Next.js 15 のApp Routerで爆速サイトを作る方法\n\nServer Componentsを使えばバンドルサイズが劇的に減少。\n体感速度が別次元になります🚀",
    status: "scheduled",
    scheduledAt: "2026-04-08T10:00:00",
    likes: 0,
    retweets: 0,
    replies: 0,
    impressions: 0,
    characterId: "2",
  },
  {
    id: "4",
    content:
      "今日の朝活ルーティン\n\n5:30 起床\n5:45 瞑想10分\n6:00 技術記事3本読む\n7:00 コーディング\n\n朝の集中力は夜の3倍✨",
    status: "scheduled",
    scheduledAt: "2026-04-09T06:00:00",
    likes: 0,
    retweets: 0,
    replies: 0,
    impressions: 0,
    characterId: "1",
  },
  {
    id: "5",
    content:
      "TypeScriptの型パズル、解けますか？\n\ntype DeepPartial<T> = ...\n\n答えは明日公開🎯",
    status: "draft",
    likes: 0,
    retweets: 0,
    replies: 0,
    impressions: 0,
    characterId: "2",
  },
  {
    id: "6",
    content:
      "副業でエンジニアが月10万稼ぐロードマップ\n\nStep1: スキル棚卸し\nStep2: クラウドソーシング登録\nStep3: 実績作り\nStep4: 単価交渉",
    status: "published",
    publishedAt: "2026-04-04T12:00:00",
    likes: 198,
    retweets: 51,
    replies: 33,
    impressions: 11800,
    characterId: "1",
  },
];

export const dummyCharacters: Character[] = [
  {
    id: "1",
    name: "テックインフルエンサー田中",
    description: "IT・副業・生産性向上を発信するキャラクター",
    tone: "親しみやすく、実践的。絵文字を多用し、箇条書きでわかりやすく伝える",
    topics: ["プログラミング", "副業", "生産性", "AI活用"],
    avatar: "👨‍💻",
    isActive: true,
  },
  {
    id: "2",
    name: "エンジニア山田",
    description: "フロントエンド技術の深堀りと最新トレンドを発信",
    tone: "技術的で正確。コードスニペットを積極的に使用し、専門家向けの内容",
    topics: ["React", "TypeScript", "Next.js", "パフォーマンス最適化"],
    avatar: "🧑‍🔬",
    isActive: false,
  },
];

export const dummyMemos: Memo[] = [
  {
    id: "1",
    title: "バズりやすいフォーマット集",
    content:
      "## 数字リスト型\n「○○な人が絶対やる3つのこと」\n\n## 共感型\n「〜〜で悩んでいませんか？」\n\n## 暴露型\n「実は〜〜だと気づきました」\n\n## ハウツー型\n「〜〜する方法を公開します」",
    tags: ["テンプレート", "バズ", "フォーマット"],
    createdAt: "2026-04-01T10:00:00",
    updatedAt: "2026-04-05T14:30:00",
  },
  {
    id: "2",
    title: "投稿最適時間メモ",
    content:
      "## 平日\n- 朝: 7:00〜8:00\n- 昼: 12:00〜13:00\n- 夜: 21:00〜23:00\n\n## 週末\n- 朝: 9:00〜10:00\n- 夜: 20:00〜22:00\n\n## 最もエンゲージメントが高かった時間\n日曜21:30（インプ22,000超え）",
    tags: ["投稿時間", "データ", "最適化"],
    createdAt: "2026-03-20T09:00:00",
    updatedAt: "2026-04-06T08:00:00",
  },
  {
    id: "3",
    title: "競合アカウント分析",
    content:
      "## Aアカウント（フォロワー5万）\n- 投稿頻度: 1日2〜3回\n- 強み: 図解が多い\n- 弱み: 文章が長い\n\n## Bアカウント（フォロワー3万）\n- 投稿頻度: 1日1回\n- 強み: 一貫したテーマ\n- 弱み: インタラクションが少ない",
    tags: ["競合分析", "リサーチ"],
    createdAt: "2026-03-15T11:00:00",
    updatedAt: "2026-03-15T11:00:00",
  },
];
