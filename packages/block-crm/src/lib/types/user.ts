import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CrmUser extends IdentityCore {
  email: string;
  name?: string;
  phone?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface RegisterCrmUserRequest {
  email: string;
  name?: string;
  phone?: string;
  payload?: Record<string, unknown>;
}

export interface ListCrmUsersParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}
