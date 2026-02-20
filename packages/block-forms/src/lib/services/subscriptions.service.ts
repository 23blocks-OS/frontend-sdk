import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Subscription,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  ListSubscriptionsParams,
} from '../types/subscription.js';
import { subscriptionMapper } from '../mappers/subscription.mapper.js';

export interface SubscriptionsService {
  /**
   * List all subscriptions for a form
   * @param formUniqueId - The unique identifier of the parent form
   * @param params - Optional filtering by status and pagination
   * @returns Paginated result containing Subscription items and metadata
   */
  list(formUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;

  /**
   * Get a specific subscription
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the subscription
   * @returns The matching Subscription record
   */
  get(formUniqueId: string, uniqueId: string): Promise<Subscription>;

  /**
   * Submit a new subscription
   * @param formUniqueId - The unique identifier of the parent form
   * @param data - Subscription details including email, name, phone, and form data
   * @returns The newly created Subscription record
   */
  submit(formUniqueId: string, data: CreateSubscriptionRequest): Promise<Subscription>;

  /**
   * Update an existing subscription
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the subscription to update
   * @param data - Fields to update such as contact info, data, or status
   * @returns The updated Subscription record
   */
  update(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription>;

  /**
   * Delete a subscription
   * @param formUniqueId - The unique identifier of the parent form
   * @param uniqueId - The unique identifier of the subscription to delete
   * @returns Resolves when the subscription has been deleted
   */
  delete(formUniqueId: string, uniqueId: string): Promise<void>;
}

export function createSubscriptionsService(transport: Transport, _config: { apiKey: string }): SubscriptionsService {
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

    async submit(formUniqueId: string, data: CreateSubscriptionRequest): Promise<Subscription> {
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
