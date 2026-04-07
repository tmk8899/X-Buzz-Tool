export type PostStatus = "published" | "scheduled" | "draft" | "failed";

export interface Post {
  id: string;
  content: string;
  status: PostStatus;
  scheduledAt?: string;
  publishedAt?: string;
  likes: number;
  retweets: number;
  replies: number;
  impressions: number;
  characterId?: string;
}

export interface Character {
  id: string;
  name: string;
  description: string;
  tone: string;
  topics: string[];
  avatar: string;
  isActive: boolean;
}

export interface Memo {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalPosts: number;
  totalImpressions: number;
  totalLikes: number;
  totalFollowers: number;
  postsThisWeek: number;
  impressionsGrowth: number;
  likesGrowth: number;
  followersGrowth: number;
}

export interface ActivityPoint {
  date: string;
  impressions: number;
  likes: number;
  posts: number;
}
