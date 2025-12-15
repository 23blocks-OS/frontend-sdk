import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LocationGroup extends IdentityCore {
  name: string;
  description?: string;
  code?: string;
  parentUniqueId?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLocationGroupRequest {
  name: string;
  description?: string;
  code?: string;
  parentUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface ListLocationGroupsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
