import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Post version - represents a specific version/revision of a post
 */
export interface PostVersion extends IdentityCore {
  uniqueId: string;
  postUniqueId: string;

  // Content
  title: string;
  abstract?: string;
  keywords?: string;
  content?: string;

  // Media
  thumbnailUrl?: string;
  imageUrl?: string;
  mediaUrl?: string;

  // Metadata
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;

  // Publishing
  publishAt?: Date;
  publishUntil?: Date;

  // Author (denormalized)
  userUniqueId?: string;
  userName?: string;
  userAlias?: string;
  userAvatarUrl?: string;

  // Visibility
  isPublic?: boolean;

  // Versioning
  version?: number;
  revision?: number;
  source?: string;

  // AI
  aiGenerated?: boolean;
  aiModel?: string;

  // Moderation (admin only)
  moderated?: boolean;
  moderatedBy?: string;
  moderatedAt?: Date;
  moderationReason?: string;
  moderationDecision?: string;
}

export interface ListPostVersionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
}
