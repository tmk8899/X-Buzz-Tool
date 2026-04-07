-- ============================================================
-- X Buzz Post Tool — Initial Schema
-- ============================================================
-- 実行順: このファイル1本をSupabase SQL Editorに貼り付けて実行
-- ============================================================


-- ============================================================
-- Utility: updated_at を自動更新するトリガー関数
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- ============================================================
-- 1. post_personas — ペルソナ設定
-- ============================================================
CREATE TABLE post_personas (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text        NOT NULL,
  description text,
  tone        text,                         -- 例: "親しみやすく、絵文字多用"
  topics      text[]      NOT NULL DEFAULT '{}',  -- 例: ["副業","AI","プログラミング"]
  avatar      text        NOT NULL DEFAULT '👤',
  is_active   boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- 1ユーザーにつきアクティブなペルソナは1つ
CREATE UNIQUE INDEX uq_post_personas_active_user
  ON post_personas (user_id)
  WHERE is_active = true;

CREATE TRIGGER trg_post_personas_updated_at
  BEFORE UPDATE ON post_personas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 2. post_ideas — 投稿アイデア / 生成リクエストのログ
-- ============================================================
CREATE TYPE tone_style_enum AS ENUM (
  'casual',    -- カジュアル
  'expert',    -- 専門家
  'story',     -- ストーリー
  'list',      -- リスト型
  'question',  -- 問いかけ
  'shock'      -- インパクト
);

CREATE TABLE post_ideas (
  id          uuid             PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid             NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  persona_id  uuid             REFERENCES post_personas(id) ON DELETE SET NULL,
  topic       text             NOT NULL,         -- 生成に使ったテーマ
  tone_style  tone_style_enum  NOT NULL DEFAULT 'casual',
  notes       text,                               -- 補足メモ
  tags        text[]           NOT NULL DEFAULT '{}',
  created_at  timestamptz      NOT NULL DEFAULT now(),
  updated_at  timestamptz      NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_ideas_user_id   ON post_ideas (user_id);
CREATE INDEX idx_post_ideas_persona   ON post_ideas (persona_id);

CREATE TRIGGER trg_post_ideas_updated_at
  BEFORE UPDATE ON post_ideas
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 3. generated_posts — AI生成された投稿候補
-- ============================================================
CREATE TYPE generated_post_status AS ENUM (
  'draft',      -- 生成直後・未確認
  'approved',   -- 使用決定
  'rejected',   -- 不採用
  'scheduled'   -- 予約済み
);

CREATE TABLE generated_posts (
  id               uuid                   PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid                   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  idea_id          uuid                   REFERENCES post_ideas(id) ON DELETE SET NULL,
  persona_id       uuid                   REFERENCES post_personas(id) ON DELETE SET NULL,
  content          text                   NOT NULL CHECK (char_length(content) BETWEEN 1 AND 280),
  status           generated_post_status  NOT NULL DEFAULT 'draft',
  -- リライト元の投稿を保持（リライト機能で使用）
  is_rewrite       boolean                NOT NULL DEFAULT false,
  original_post_id uuid                   REFERENCES generated_posts(id) ON DELETE SET NULL,
  -- Anthropic APIのメタ情報（将来用）
  model_used       text,
  prompt_tokens    integer,
  created_at       timestamptz            NOT NULL DEFAULT now(),
  updated_at       timestamptz            NOT NULL DEFAULT now()
);

CREATE INDEX idx_generated_posts_user_id  ON generated_posts (user_id);
CREATE INDEX idx_generated_posts_idea_id  ON generated_posts (idea_id);
CREATE INDEX idx_generated_posts_status   ON generated_posts (user_id, status);

CREATE TRIGGER trg_generated_posts_updated_at
  BEFORE UPDATE ON generated_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 4. scheduled_posts — 予約投稿 / 公開管理
-- ============================================================
CREATE TYPE scheduled_post_status AS ENUM (
  'scheduled',   -- 予約中
  'published',   -- 公開済み
  'failed',      -- 投稿失敗
  'cancelled'    -- キャンセル
);

CREATE TABLE scheduled_posts (
  id                  uuid                   PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid                   NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  generated_post_id   uuid                   REFERENCES generated_posts(id) ON DELETE SET NULL,
  -- 直接入力 or generated_posts からコピー（公開後に元が変わっても記録が残る）
  content             text                   NOT NULL CHECK (char_length(content) BETWEEN 1 AND 280),
  scheduled_at        timestamptz            NOT NULL,
  published_at        timestamptz,
  -- X API から返ってくる投稿ID（公開後に保存）
  x_post_id           text,
  status              scheduled_post_status  NOT NULL DEFAULT 'scheduled',
  error_message       text,                  -- 失敗時のエラー詳細
  created_at          timestamptz            NOT NULL DEFAULT now(),
  updated_at          timestamptz            NOT NULL DEFAULT now()
);

CREATE INDEX idx_scheduled_posts_user_id      ON scheduled_posts (user_id);
CREATE INDEX idx_scheduled_posts_status       ON scheduled_posts (user_id, status);
CREATE INDEX idx_scheduled_posts_scheduled_at ON scheduled_posts (scheduled_at)
  WHERE status = 'scheduled';   -- 予約中のみ対象（部分インデックス）

CREATE TRIGGER trg_scheduled_posts_updated_at
  BEFORE UPDATE ON scheduled_posts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ============================================================
-- 5. post_metrics — 投稿のエンゲージメント指標
-- ============================================================
CREATE TABLE post_metrics (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_post_id   uuid        NOT NULL REFERENCES scheduled_posts(id) ON DELETE CASCADE,
  -- X API v2 Public Metrics
  impressions         integer     NOT NULL DEFAULT 0,
  likes               integer     NOT NULL DEFAULT 0,
  retweets            integer     NOT NULL DEFAULT 0,
  replies             integer     NOT NULL DEFAULT 0,
  -- X API v2 Non-Public Metrics (要Elevated Access)
  profile_visits      integer              DEFAULT 0,
  url_clicks          integer              DEFAULT 0,
  -- 取得日時（同一投稿でも時系列で複数レコードを保存可能）
  fetched_at          timestamptz NOT NULL DEFAULT now(),
  created_at          timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_post_metrics_post_id    ON post_metrics (scheduled_post_id);
CREATE INDEX idx_post_metrics_fetched_at ON post_metrics (scheduled_post_id, fetched_at DESC);


-- ============================================================
-- Row Level Security (RLS) — 自分のデータのみアクセス可能
-- ============================================================

ALTER TABLE post_personas    ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_ideas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE scheduled_posts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_metrics     ENABLE ROW LEVEL SECURITY;

-- post_personas
CREATE POLICY "own_personas" ON post_personas
  FOR ALL USING (auth.uid() = user_id);

-- post_ideas
CREATE POLICY "own_ideas" ON post_ideas
  FOR ALL USING (auth.uid() = user_id);

-- generated_posts
CREATE POLICY "own_generated_posts" ON generated_posts
  FOR ALL USING (auth.uid() = user_id);

-- scheduled_posts
CREATE POLICY "own_scheduled_posts" ON scheduled_posts
  FOR ALL USING (auth.uid() = user_id);

-- post_metrics（scheduled_posts 経由でユーザーを確認）
CREATE POLICY "own_post_metrics" ON post_metrics
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM scheduled_posts sp
      WHERE sp.id = post_metrics.scheduled_post_id
        AND sp.user_id = auth.uid()
    )
  );
