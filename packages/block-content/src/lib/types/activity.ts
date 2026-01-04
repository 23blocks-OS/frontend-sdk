import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Content activity types
 */
export type ActivityType =
  | 'post_created'
  | 'post_updated'
  | 'post_liked'
  | 'post_shared'
  | 'comment_created'
  | 'comment_liked'
  | 'comment_reply'
  | 'followed'
  | 'unfollowed'
  | 'saved'
  | 'unsaved';

/**
 * Activity feed item
 */
export interface Activity extends IdentityCore {
  activityType: ActivityType;
  actorUniqueId: string;
  actorName?: string;
  actorAvatarUrl?: string;
  targetType: 'post' | 'comment' | 'user';
  targetUniqueId: string;
  targetTitle?: string;
  targetPreview?: string;
  relatedUniqueId?: string;
  relatedType?: string;
  metadata?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
}

/**
 * List activities params
 */
export interface ListActivitiesParams {
  page?: number;
  perPage?: number;
  identityUniqueId?: string;
  activityType?: ActivityType;
  targetType?: 'post' | 'comment' | 'user';
  dateFrom?: string;
  dateTo?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
