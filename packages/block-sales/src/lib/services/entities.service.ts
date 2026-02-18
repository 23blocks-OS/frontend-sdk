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

function buildEntityBody(data: RegisterSalesEntityRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.entityType) body['entity_type'] = data.entityType;
  if (data.entityAlias) body['entity_alias'] = data.entityAlias;
  if (data.entitySource) body['entity_source'] = data.entitySource;
  if (data.entityUrl) body['entity_url'] = data.entityUrl;
  if (data.stripeId) body['stripe_id'] = data.stripeId;
  if (data.status) body['status'] = data.status;
  if (data.timeZone) body['time_zone'] = data.timeZone;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.avatarUrl) body['avatar_url'] = data.avatarUrl;
  return body;
}

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
        entity: data ? buildEntityBody(data) : {},
      });
      return decodeOne(response, salesEntityMapper);
    },

    async update(uniqueId: string, data: UpdateSalesEntityRequest): Promise<SalesEntity> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}`, {
        entity: buildEntityBody(data),
      });
      return decodeOne(response, salesEntityMapper);
    },

    async createSubscription(uniqueId: string, data: CreateEntitySubscriptionRequest): Promise<EntitySubscription> {
      const response = await transport.post<unknown>(`/entities/${uniqueId}/subscriptions`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          owner_unique_id: data.ownerUniqueId,
          owner_type: data.ownerType,
        },
      });
      return decodeOne(response, entitySubscriptionMapper);
    },

    async updateSubscription(uniqueId: string, subscriptionUniqueId: string, data: UpdateEntitySubscriptionRequest): Promise<EntitySubscription> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}/subscriptions/${subscriptionUniqueId}`, {
        subscription: {
          subscription_model_unique_id: data.subscriptionModelUniqueId,
          owner_unique_id: data.ownerUniqueId,
          owner_type: data.ownerType,
        },
      });
      return decodeOne(response, entitySubscriptionMapper);
    },
  };
}
