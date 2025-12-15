import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LeadFollow extends IdentityCore {
  leadUniqueId: string;
  userUniqueId?: string;
  followType?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  notes?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateLeadFollowRequest {
  userUniqueId?: string;
  followType?: string;
  scheduledAt?: Date;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateLeadFollowRequest {
  followType?: string;
  scheduledAt?: Date;
  completedAt?: Date;
  notes?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLeadFollowsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  followType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
