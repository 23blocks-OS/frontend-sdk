import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface TeamMember extends IdentityCore {
  teamUniqueId: string;
  userUniqueId: string;
  role?: string;
  joinedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface AddTeamMemberRequest {
  teamUniqueId: string;
  userUniqueId: string;
  role?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateTeamMemberRequest {
  role?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTeamMembersParams {
  page?: number;
  perPage?: number;
  teamUniqueId?: string;
  userUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
