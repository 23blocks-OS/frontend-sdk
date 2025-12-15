import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Subscriber extends IdentityCore {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source?: string;
  sourceId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}

// Request types
export interface CreateSubscriberRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source?: string;
  sourceId?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateSubscriberRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  source?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListSubscribersParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  source?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
