import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Subscription, CreateSubscriptionRequest, UpdateSubscriptionRequest, ListSubscriptionsParams } from '../types/subscription';
import { subscriptionMapper } from '../mappers/subscription.mapper';

export interface SubscriptionsService {
  list(params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;
  get(uniqueId: string): Promise<Subscription>;
  create(data: CreateSubscriptionRequest): Promise<Subscription>;
  update(uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription>;
  cancel(uniqueId: string): Promise<Subscription>;
  pause(uniqueId: string): Promise<Subscription>;
  resume(uniqueId: string): Promise<Subscription>;
  listByUser(userUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;
}

export function createSubscriptionsService(transport: Transport, _config: { appId: string }): SubscriptionsService {
  return {
    async list(params?: ListSubscriptionsParams): Promise<PageResult<Subscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.planUniqueId) queryParams['plan_unique_id'] = params.planUniqueId;
      if (params?.interval) queryParams['interval'] = params.interval;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/subscriptions', { params: queryParams });
      return decodePageResult(response, subscriptionMapper);
    },

    async get(uniqueId: string): Promise<Subscription> {
      const response = await transport.get<unknown>(`/subscriptions/${uniqueId}`);
      return decodeOne(response, subscriptionMapper);
    },

    async create(data: CreateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.post<unknown>('/subscriptions', {
        subscription: {
          user_unique_id: data.userUniqueId,
          plan_unique_id: data.planUniqueId,
          plan_name: data.planName,
          price: data.price,
          currency: data.currency,
          interval: data.interval,
          start_date: data.startDate?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async update(uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${uniqueId}`, {
        subscription: {
          plan_unique_id: data.planUniqueId,
          plan_name: data.planName,
          price: data.price,
          currency: data.currency,
          interval: data.interval,
          status: data.status,
          end_date: data.endDate?.toISOString(),
          next_billing_date: data.nextBillingDate?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async cancel(uniqueId: string): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${uniqueId}/cancel`, {});
      return decodeOne(response, subscriptionMapper);
    },

    async pause(uniqueId: string): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${uniqueId}/pause`, {});
      return decodeOne(response, subscriptionMapper);
    },

    async resume(uniqueId: string): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${uniqueId}/resume`, {});
      return decodeOne(response, subscriptionMapper);
    },

    async listByUser(userUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.planUniqueId) queryParams['plan_unique_id'] = params.planUniqueId;
      if (params?.interval) queryParams['interval'] = params.interval;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/subscriptions`, { params: queryParams });
      return decodePageResult(response, subscriptionMapper);
    },
  };
}
