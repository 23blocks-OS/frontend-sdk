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
  code?: string;
  notes?: string;
  nextActionAt?: Date;
  reminder?: boolean;
  total?: number;
  ownerUniqueId?: string;
  ownerName?: string;
  ownerEmail?: string;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  status?: string;
}

export interface UpdateLeadFollowRequest {
  code?: string;
  notes?: string;
  nextActionAt?: Date;
  reminder?: boolean;
  total?: number;
  ownerUniqueId?: string;
  ownerName?: string;
  ownerEmail?: string;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  status?: string;
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
