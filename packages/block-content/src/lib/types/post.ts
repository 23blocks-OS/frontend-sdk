import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Post extends IdentityCore {
  uniqueId: string;
  postVersionUniqueId?: string;
  title: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  publishAt?: Date;
  publishUntil?: Date;

  // User (denormalized)
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  // Visibility
  isPublic?: boolean;

  // Versioning
  version?: number;

  // Engagement metrics
  likes?: number;
  dislikes?: number;
  comments?: number;
  followers?: number;
  savers?: number;

  // SEO
  slug?: string;

  // AI
  aiGenerated?: boolean;
  aiModel?: string;

  // Moderation
  moderated?: boolean;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationReason?: string;
  moderationDecision?: string;
}

// Request types
export interface CreatePostRequest {
  title: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  categoryUniqueIds?: string[];
  tagUniqueIds?: string[];
  isPublic?: boolean;
  publishAt?: Date;
  publishUntil?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdatePostRequest {
  title?: string;
  abstract?: string;
  keywords?: string;
  content?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;
  categoryUniqueIds?: string[];
  tagUniqueIds?: string[];
  isPublic?: boolean;
  publishAt?: Date;
  publishUntil?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPostsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  categoryUniqueId?: string;
  tagUniqueId?: string;
  userUniqueId?: string;
  search?: string;
  withComments?: boolean;
  withCategories?: boolean;
  withTags?: boolean;
  isPublic?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
