import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Badge extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  imageUrl?: string;
  criteria?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateBadgeRequest {
  code: string;
  name: string;
  description?: string;
  imageUrl?: string;
  criteria?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateBadgeRequest {
  name?: string;
  description?: string;
  imageUrl?: string;
  criteria?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListBadgesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AwardBadgeRequest {
  badgeUniqueId: string;
  userUniqueId: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface UserBadge extends IdentityCore {
  badgeUniqueId: string;
  badgeCode: string;
  badgeName: string;
  badgeImageUrl?: string;
  userUniqueId: string;
  awardedAt: Date;
  reason?: string;
  metadata?: Record<string, unknown>;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListUserBadgesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
