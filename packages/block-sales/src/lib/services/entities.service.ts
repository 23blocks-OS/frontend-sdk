import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SalesEntity,
  RegisterSalesEntityRequest,
  UpdateSalesEntityRequest,
  ListSalesEntitiesParams,
  EntitySubscription,
  CreateEntitySubscriptionRequest,
  UpdateEntitySubscriptionRequest,
} from '../types/entity';
import { salesEntityMapper } from '../mappers/entity.mapper';

export interface SalesEntitiesService {
  list(params?: ListSalesEntitiesParams): Promise<PageResult<SalesEntity>>;
  get(uniqueId: string): Promise<SalesEntity>;
  register(uniqueId: string, data?: RegisterSalesEntityRequest): Promise<SalesEntity>;
  update(uniqueId: string, data: UpdateSalesEntityRequest): Promise<SalesEntity>;
  createSubscription(uniqueId: string, data: CreateEntitySubscriptionRequest): Promise<EntitySubscription>;
  updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateEntitySubscriptionRequest): Promise<EntitySubscription>;
}

export function createSalesEntitiesService(transport: Transport, _config: { appId: string }): SalesEntitiesService {
  return {
    async list(params?: ListSalesEntitiesParams): Promise<PageResult<SalesEntity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entities', { params: queryParams });
      return decodePageResult(response, salesEntityMapper);
    },

    async get(uniqueId: string): Promise<SalesEntity> {
      const response = await transport.get<unknown>(`/entities/${uniqueId}`);
      return decodeOne(response, salesEntityMapper);
    },

    async register(uniqueId: string, data?: RegisterSalesEntityRequest): Promise<SalesEntity> {
      const response = await transport.post<unknown>(`/entities/${uniqueId}/register`, {
        entity: {
          code: data?.code,
          name: data?.name,
          email: data?.email,
          phone: data?.phone,
          payload: data?.payload,
        },
      });
      return decodeOne(response, salesEntityMapper);
    },

    async update(uniqueId: string, data: UpdateSalesEntityRequest): Promise<SalesEntity> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}`, {
        entity: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, salesEntityMapper);
    },

    async createSubscription(uniqueId: string, data: CreateEntitySubscriptionRequest): Promise<EntitySubscription> {
      const response = await transport.post<any>(`/entities/${uniqueId}/subscriptions`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          start_date: data.startDate,
          trial_end_date: data.trialEndDate,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateEntitySubscriptionRequest): Promise<EntitySubscription> {
      const response = await transport.put<any>(`/entities/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          status: data.status,
          end_date: data.endDate,
          payload: data.payload,
        },
      });
      return {
        id: response.id,
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        subscriptionModelUniqueId: response.subscription_model_unique_id,
        status: response.status,
        startDate: response.start_date ? new Date(response.start_date) : undefined,
        endDate: response.end_date ? new Date(response.end_date) : undefined,
        trialEndDate: response.trial_end_date ? new Date(response.trial_end_date) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        payload: response.payload,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },
  };
}
