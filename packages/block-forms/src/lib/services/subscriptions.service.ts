import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ListSubscriptionsParams,
} from '../types/subscription';
import { subscriptionMapper } from '../mappers/subscription.mapper';

export interface SubscriptionsService {
  list(formUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;
  get(formUniqueId: string, uniqueId: string): Promise<Subscription>;
  create(formUniqueId: string, data: CreateSubscriptionRequest): Promise<Subscription>;
  update(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription>;
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createSubscriptionsService(transport: Transport, _config: { appId: string }): SubscriptionsService {
  return {
    async list(formUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/subscriptions/${formUniqueId}/instances`, { params: queryParams });
      return decodePageResult(response, subscriptionMapper);
    },

    async get(formUniqueId: string, uniqueId: string): Promise<Subscription> {
      const response = await transport.get<unknown>(`/subscriptions/${formUniqueId}/instances/${uniqueId}`);
      return decodeOne(response, subscriptionMapper);
    },

    async create(formUniqueId: string, data: CreateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.post<unknown>(`/subscriptions/${formUniqueId}/instances`, {
        subscription: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          data: data.data,
          payload: data.payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${formUniqueId}/instances/${uniqueId}`, {
        subscription: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          data: data.data,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/subscriptions/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
