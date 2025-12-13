import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Audience extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  criteria?: Record<string, unknown>;
  memberCount?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateAudienceRequest {
  code: string;
  name: string;
  description?: string;
  criteria?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateAudienceRequest {
  name?: string;
  description?: string;
  criteria?: Record<string, unknown>;
  memberCount?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAudiencesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}

export interface AudienceMember {
  uniqueId: string;
  audienceUniqueId: string;
  userUniqueId?: string;
  email?: string;
  name?: string;
  addedAt?: Date;
  payload?: Record<string, unknown>;
}
