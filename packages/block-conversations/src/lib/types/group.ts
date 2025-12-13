import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Group extends IdentityCore {
  name: string;
  code?: string;
  uniqueCode?: string;
  qcode?: string;
  groupType?: string;

  // Members
  members?: string[];

  // Status
  status: EntityStatus;
  enabled: boolean;

  // Source
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra data
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateGroupRequest {
  name: string;
  code?: string;
  uniqueCode?: string;
  qcode?: string;
  groupType?: string;
  members?: string[];
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateGroupRequest {
  name?: string;
  code?: string;
  uniqueCode?: string;
  qcode?: string;
  groupType?: string;
  members?: string[];
  status?: EntityStatus;
  enabled?: boolean;
  payload?: Record<string, unknown>;
}

export interface ListGroupsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  groupType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
