import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Subscription extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateSubscriptionRequest {
  formUniqueId?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  data?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateSubscriptionRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  data?: Record<string, unknown>;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
