-- ============================================================
-- 開発用シードデータ（本番では実行しないこと）
-- 実行前に auth.users に手動でユーザーを作成し、
-- 下記の :user_id を実際の uuid に置き換えてください
-- ============================================================

-- ※ Supabase SQL Editor では変数が使えないため、
--    実際の uuid を直接コピペして使用してください
--    例: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'

DO $$
DECLARE
  v_user_id uuid;
  v_persona1_id uuid;
  v_persona2_id uuid;
  v_idea1_id uuid;
  v_post1_id uuid;
  v_post2_id uuid;
  v_sched1_id uuid;
BEGIN
  -- ダッシュボードで確認できるユーザーIDに変更してください
  -- Supabase > Authentication > Users からコピー
  v_user_id := '00000000-0000-0000-0000-000000000000'::uuid;

  -- ペルソナ
  INSERT INTO post_personas (id, user_id, name, description, tone, topics, avatar, is_active)
  VALUES
    (gen_random_uuid(), v_user_id,
     'テックインフルエンサー田中',
     'IT・副業・生産性向上を発信するキャラクター',
     '親しみやすく、実践的。絵文字を多用し、箇条書きでわかりやすく伝える',
     ARRAY['プログラミング','副業','生産性','AI活用'],
     '👨‍💻', true)
  RETURNING id INTO v_persona1_id;

  INSERT INTO post_personas (id, user_id, name, description, tone, topics, avatar, is_active)
  VALUES
    (gen_random_uuid(), v_user_id,
     'エンジニア山田',
     'フロントエンド技術の深堀りと最新トレンドを発信',
     '技術的で正確。コードスニペットを積極的に使用',
     ARRAY['React','TypeScript','Next.js','パフォーマンス最適化'],
     '🧑‍🔬', false)
  RETURNING id INTO v_persona2_id;

  -- アイデア
  INSERT INTO post_ideas (id, user_id, persona_id, topic, tone_style)
  VALUES
    (gen_random_uuid(), v_user_id, v_persona1_id, 'フリーランスエンジニアが月収を上げる方法', 'list')
  RETURNING id INTO v_idea1_id;

  -- 生成済み投稿
  INSERT INTO generated_posts (id, user_id, idea_id, persona_id, content, status)
  VALUES
    (gen_random_uuid(), v_user_id, v_idea1_id, v_persona1_id,
     'AIを活用したコンテンツ戦略で、フォロワーが3ヶ月で2倍になった方法を公開します。' || chr(10) ||
     '① ターゲット分析' || chr(10) || '② コンテンツカレンダー作成' || chr(10) || '③ A/Bテスト実施' || chr(10) ||
     '詳細はスレッドで👇',
     'published')
  RETURNING id INTO v_post1_id;

  INSERT INTO generated_posts (id, user_id, idea_id, persona_id, content, status)
  VALUES
    (gen_random_uuid(), v_user_id, v_idea1_id, v_persona1_id,
     'Next.js 15 のApp Routerで爆速サイトを作る方法' || chr(10) ||
     'Server Componentsを使えばバンドルサイズが劇的に減少。体感速度が別次元になります🚀',
     'scheduled')
  RETURNING id INTO v_post2_id;

  -- 予約投稿
  INSERT INTO scheduled_posts (id, user_id, generated_post_id, content, scheduled_at, published_at, x_post_id, status)
  VALUES
    (gen_random_uuid(), v_user_id, v_post1_id,
     'AIを活用したコンテンツ戦略で、フォロワーが3ヶ月で2倍になった方法を公開します。',
     '2026-04-06 09:00:00+09', '2026-04-06 09:00:05+09',
     '1234567890123456789', 'published')
  RETURNING id INTO v_sched1_id;

  -- メトリクス
  INSERT INTO post_metrics (scheduled_post_id, impressions, likes, retweets, replies, fetched_at)
  VALUES
    (v_sched1_id, 22400, 380, 94, 42, now());

  RAISE NOTICE 'Seed data inserted. persona1_id=%', v_persona1_id;
END $$;
