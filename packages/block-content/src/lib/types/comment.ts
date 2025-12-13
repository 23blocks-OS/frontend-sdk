import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Comment extends IdentityCore {
  uniqueId: string;
  postUniqueId: string;
  postVersion?: number;
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;

  // User (denormalized)
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;

  // Threading
  parentId?: string;

  // Engagement metrics
  likes?: number;
  dislikes?: number;
  followers?: number;
  savers?: number;

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
export interface CreateCommentRequest {
  postUniqueId: string;
  content: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  parentId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCommentRequest {
  content?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCommentsParams {
  page?: number;
  perPage?: number;
  postUniqueId?: string;
  userUniqueId?: string;
  parentId?: string;
  status?: EntityStatus;
}
