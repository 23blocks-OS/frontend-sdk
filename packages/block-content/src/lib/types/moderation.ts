import type { EntityStatus } from '@23blocks/contracts';

/**
 * Moderation action types
 */
export type ModerationAction = 'hide' | 'delete' | 'flag' | 'unflag' | 'approve' | 'reject';

/**
 * Moderation result
 */
export interface ModerationResult {
  success: boolean;
  action: ModerationAction;
  moderatedAt: Date;
  moderatedBy?: string;
  reason?: string;
}

/**
 * Moderation request
 */
export interface ModerateContentRequest {
  action: ModerationAction;
  reason?: string;
}

/**
 * Content flag
 */
export interface ContentFlag {
  uniqueId: string;
  contentType: 'post' | 'comment';
  contentUniqueId: string;
  reporterUniqueId: string;
  reason: string;
  category?: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other';
  status: EntityStatus;
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
}

/**
 * Create content flag request
 */
export interface CreateContentFlagRequest {
  contentType: 'post' | 'comment';
  contentUniqueId: string;
  reason: string;
  category?: 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other';
}

/**
 * List content flags params
 */
export interface ListContentFlagsParams {
  page?: number;
  perPage?: number;
  contentType?: 'post' | 'comment';
  category?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
