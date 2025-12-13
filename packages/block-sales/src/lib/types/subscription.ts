import type { IdentityCore } from '@23blocks/contracts';

export type SubscriptionInterval = 'monthly' | 'yearly';
export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'paused';

export interface Subscription extends IdentityCore {
  userUniqueId: string;
  planUniqueId: string;
  planName: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateSubscriptionRequest {
  userUniqueId: string;
  planUniqueId: string;
  planName: string;
  price: number;
  currency: string;
  interval: SubscriptionInterval;
  startDate?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdateSubscriptionRequest {
  planUniqueId?: string;
  planName?: string;
  price?: number;
  currency?: string;
  interval?: SubscriptionInterval;
  status?: SubscriptionStatus;
  endDate?: Date;
  nextBillingDate?: Date;
  payload?: Record<string, unknown>;
}

export interface ListSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: SubscriptionStatus;
  userUniqueId?: string;
  planUniqueId?: string;
  interval?: SubscriptionInterval;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
