import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Team extends IdentityCore {
  departmentUniqueId: string;
  code: string;
  name: string;
  description?: string;
  leaderUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateTeamRequest {
  departmentUniqueId: string;
  code: string;
  name: string;
  description?: string;
  leaderUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  leaderUniqueId?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTeamsParams {
  page?: number;
  perPage?: number;
  departmentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
