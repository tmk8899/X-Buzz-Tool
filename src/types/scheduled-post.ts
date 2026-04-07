export type ScheduledPostStatus = "scheduled" | "published" | "failed" | "cancelled";

export interface ScheduledPost {
  id: string;
  content: string;
  scheduledAt: string;        // ISO 8601
  publishedAt?: string;
  status: ScheduledPostStatus;
  errorMessage?: string;
  // 将来用 — X API 連携後に設定
  xPostId?: string;
  // 生成投稿との紐付け（将来 Supabase 化後に使用）
  generatedPostId?: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateScheduledPostInput = Pick<ScheduledPost, "content" | "scheduledAt">;
export type UpdateScheduledPostInput = Partial<Pick<ScheduledPost, "content" | "scheduledAt" | "status">>;
