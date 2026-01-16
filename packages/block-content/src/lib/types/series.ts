import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type SeriesVisibility = 'public' | 'private' | 'unlisted';
export type SeriesCompletionStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';

export interface Series extends IdentityCore {
  uniqueId: string;
  title: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  status: EntityStatus;
  enabled: boolean;
  visibility?: SeriesVisibility;
  completionStatus?: SeriesCompletionStatus;

  // User (denormalized)
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  // Engagement metrics
  postsCount?: number;
  likes?: number;
  dislikes?: number;
  followers?: number;
  savers?: number;

  // AI
  aiGenerated?: boolean;
  aiModel?: string;

  // Moderation
  moderated?: boolean;

  // Flexible metadata
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateSeriesRequest {
  title: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  visibility?: SeriesVisibility;
  completionStatus?: SeriesCompletionStatus;
  payload?: Record<string, unknown>;
}

export interface UpdateSeriesRequest {
  title?: string;
  description?: string;
  slug?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  visibility?: SeriesVisibility;
  completionStatus?: SeriesCompletionStatus;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListSeriesParams {
  page?: number;
  perPage?: number;
}

export interface QuerySeriesParams {
  page?: number;
  perPage?: number;
  visibility?: SeriesVisibility;
  completionStatus?: SeriesCompletionStatus;
  search?: string;
  userUniqueId?: string;
}

export interface ReorderPostsRequest {
  posts: Array<{
    postUniqueId: string;
    sequence: number;
  }>;
}
