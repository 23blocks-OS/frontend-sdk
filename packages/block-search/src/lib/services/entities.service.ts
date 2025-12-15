import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SearchEntity,
  EntityTypeSchema,
  RegisterEntityRequest,
  UpdateEntityRequest,
  ListEntitiesParams,
  CopilotSearchRequest,
} from '../types/entity.js';
import { searchEntityMapper } from '../mappers/entity.mapper.js';

export interface EntitiesService {
  list(params?: ListEntitiesParams): Promise<PageResult<SearchEntity>>;
  get(uniqueId: string): Promise<SearchEntity>;
  register(uniqueId: string, data: RegisterEntityRequest): Promise<SearchEntity>;
  update(uniqueId: string, data: UpdateEntityRequest): Promise<SearchEntity>;
  delete(uniqueId: string): Promise<void>;
  listEntityTypes(): Promise<{ entityType: string }[]>;
  getEntityTypeSchema(entityType: string): Promise<EntityTypeSchema>;
  searchByCopilot(data: CopilotSearchRequest): Promise<SearchEntity[]>;
}

export function createEntitiesService(transport: Transport, _config: { appId: string }): EntitiesService {
  return {
    async list(params?: ListEntitiesParams): Promise<PageResult<SearchEntity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.entityType) queryParams['entity_type'] = params.entityType;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entities/', { params: queryParams });
      return decodePageResult(response, searchEntityMapper);
    },

    async get(uniqueId: string): Promise<SearchEntity> {
      const response = await transport.get<unknown>(`/entities/${uniqueId}/`);
      return decodeOne(response, searchEntityMapper);
    },

    async register(uniqueId: string, data: RegisterEntityRequest): Promise<SearchEntity> {
      const response = await transport.post<unknown>(`/entities/${uniqueId}/register/`, {
        entity: {
          entity_type: data.entityType,
          alias: data.alias,
          description: data.description,
          avatar_url: data.avatarUrl,
          url: data.url,
          source: data.source,
          payload: data.payload,
        },
      });
      return decodeOne(response, searchEntityMapper);
    },

    async update(uniqueId: string, data: UpdateEntityRequest): Promise<SearchEntity> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}/`, {
        entity: {
          alias: data.alias,
          description: data.description,
          avatar_url: data.avatarUrl,
          url: data.url,
          source: data.source,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, searchEntityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}/`);
    },

    async listEntityTypes(): Promise<{ entityType: string }[]> {
      const response = await transport.get<unknown>('/entity_types/');
      if (Array.isArray(response)) {
        return response.map((item: unknown) => ({
          entityType: (item as { entity_type?: string }).entity_type ?? '',
        }));
      }
      return [];
    },

    async getEntityTypeSchema(entityType: string): Promise<EntityTypeSchema> {
      const response = await transport.get<unknown>(`/entity_types/${entityType}/`);
      return response as EntityTypeSchema;
    },

    async searchByCopilot(data: CopilotSearchRequest): Promise<SearchEntity[]> {
      const response = await transport.post<unknown>('/entities/search', {
        query: data.query,
        entity_types: data.entityTypes,
        limit: data.limit,
      });
      return decodeMany(response, searchEntityMapper);
    },
  };
}
