// ============================================================
// Supabase Database Types
// 将来 `npx supabase gen types typescript` で自動生成に切り替え可能
// ============================================================

export type ToneStyle = "casual" | "expert" | "story" | "list" | "question" | "shock";
export type GeneratedPostStatus = "draft" | "approved" | "rejected" | "scheduled";
export type ScheduledPostStatus = "scheduled" | "published" | "failed" | "cancelled";

// ---------- post_personas ----------
export interface PostPersona {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  tone: string | null;
  topics: string[];
  avatar: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type InsertPostPersona = Omit<PostPersona, "id" | "created_at" | "updated_at">;
export type UpdatePostPersona = Partial<InsertPostPersona>;

// ---------- post_ideas ----------
export interface PostIdea {
  id: string;
  user_id: string;
  persona_id: string | null;
  topic: string;
  tone_style: ToneStyle;
  notes: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type InsertPostIdea = Omit<PostIdea, "id" | "created_at" | "updated_at">;

// ---------- generated_posts ----------
export interface GeneratedPost {
  id: string;
  user_id: string;
  idea_id: string | null;
  persona_id: string | null;
  content: string;
  status: GeneratedPostStatus;
  is_rewrite: boolean;
  original_post_id: string | null;
  model_used: string | null;
  prompt_tokens: number | null;
  created_at: string;
  updated_at: string;
}

export type InsertGeneratedPost = Omit<GeneratedPost, "id" | "created_at" | "updated_at">;

// ---------- scheduled_posts ----------
export interface ScheduledPost {
  id: string;
  user_id: string;
  generated_post_id: string | null;
  content: string;
  scheduled_at: string;
  published_at: string | null;
  x_post_id: string | null;
  status: ScheduledPostStatus;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export type InsertScheduledPost = Omit<ScheduledPost, "id" | "created_at" | "updated_at">;

// ---------- post_metrics ----------
export interface PostMetric {
  id: string;
  scheduled_post_id: string;
  impressions: number;
  likes: number;
  retweets: number;
  replies: number;
  profile_visits: number | null;
  url_clicks: number | null;
  fetched_at: string;
  created_at: string;
}

export type InsertPostMetric = Omit<PostMetric, "id" | "created_at">;

// ---------- Database helper type ----------
export interface Database {
  public: {
    Tables: {
      post_personas:   { Row: PostPersona;   Insert: InsertPostPersona;   Update: UpdatePostPersona };
      post_ideas:      { Row: PostIdea;      Insert: InsertPostIdea;      Update: Partial<InsertPostIdea> };
      generated_posts: { Row: GeneratedPost; Insert: InsertGeneratedPost; Update: Partial<InsertGeneratedPost> };
      scheduled_posts: { Row: ScheduledPost; Insert: InsertScheduledPost; Update: Partial<InsertScheduledPost> };
      post_metrics:    { Row: PostMetric;    Insert: InsertPostMetric;    Update: Partial<InsertPostMetric> };
    };
  };
}
