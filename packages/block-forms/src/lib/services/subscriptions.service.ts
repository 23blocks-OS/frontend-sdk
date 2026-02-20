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
  list(formUniqueId: string, params?: ListSubscriptionsParams): Promise<PageResult<Subscription>>;
  get(formUniqueId: string, uniqueId: string): Promise<Subscription>;
  submit(formUniqueId: string, data: CreateSubscriptionRequest): Promise<Subscription>;
  update(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription>;
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
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async update(formUniqueId: string, uniqueId: string, data: UpdateSubscriptionRequest): Promise<Subscription> {
      const response = await transport.put<unknown>(`/subscriptions/${formUniqueId}/instances/${uniqueId}`, {
        subscription: {
          email: data.email,
          first_name: data.firstName,
          middle_name: data.middleName,
          last_name: data.lastName,
          phone_number: data.phoneNumber,
          notes: data.notes,
          selected_option: data.selectedOption,
          form_fields: data.formFields,
          source: data.source,
          source_alias: data.sourceAlias,
          source_id: data.sourceId,
          source_type: data.sourceType,
          visitor_unique_id: data.visitorUniqueId,
          visitor_type: data.visitorType,
          touch_id: data.touchId,
          touch_reference_id: data.touchReferenceId,
          status: data.status,
        },
      });
      return decodeOne(response, subscriptionMapper);
    },

    async delete(formUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/subscriptions/${formUniqueId}/instances/${uniqueId}`);
    },
  };
}
