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
} from '../types/entity.js';
import { salesEntityMapper } from '../mappers/entity.mapper.js';
import { entitySubscriptionMapper } from '../mappers/entity-subscription.mapper.js';

export interface SalesEntitiesService {
  /**
   * List sales entities with optional filtering and sorting.
   * @returns Paginated list of SalesEntity records with metadata.
   */
  list(params?: ListSalesEntitiesParams): Promise<PageResult<SalesEntity>>;

  /**
   * Get a sales entity by unique ID.
   * @returns The matching SalesEntity record.
   */
  get(uniqueId: string): Promise<SalesEntity>;

  /**
   * Register a new sales entity.
   * @returns The newly registered SalesEntity record.
   */
  register(uniqueId: string, data?: RegisterSalesEntityRequest): Promise<SalesEntity>;

  /**
   * Update an existing sales entity.
   * @returns The updated SalesEntity record.
   */
  update(uniqueId: string, data: UpdateSalesEntityRequest): Promise<SalesEntity>;

  /**
   * Create a subscription for an entity.
   * @returns The newly created EntitySubscription record.
   */
  createSubscription(uniqueId: string, data: CreateEntitySubscriptionRequest): Promise<EntitySubscription>;

  /**
   * Update an entity subscription.
   * @returns The updated EntitySubscription record.
   */
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
      const response = await transport.post<unknown>(`/entities/${uniqueId}/subscriptions`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          start_date: data.startDate,
          trial_end_date: data.trialEndDate,
          payload: data.payload,
        },
      });
      return decodeOne(response, entitySubscriptionMapper);
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateEntitySubscriptionRequest): Promise<EntitySubscription> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          status: data.status,
          end_date: data.endDate,
          payload: data.payload,
        },
      });
      return decodeOne(response, entitySubscriptionMapper);
    },
  };
}
