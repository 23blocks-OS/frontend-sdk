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
  /**
   * List search entities with optional filtering, pagination, and sorting.
   * @param params - Optional filtering, pagination, and sorting parameters.
   * @returns A paginated result containing an array of {@link SearchEntity} items and pagination metadata.
   * @note The `perPage` param is sent as `records` to the backend API.
   * @note Sort order is expressed via a `-` prefix on the field name for descending (JSON:API convention).
   */
  list(params?: ListEntitiesParams): Promise<PageResult<SearchEntity>>;

  /**
   * Get a single search entity by its unique ID.
   * @param uniqueId - The unique identifier of the entity.
   * @returns The matching {@link SearchEntity}.
   */
  get(uniqueId: string): Promise<SearchEntity>;

  /**
   * Register a new search entity under a given unique ID.
   * @param uniqueId - The unique identifier to assign to the entity.
   * @param data - The entity registration payload including entityType, alias, description, and optional fields.
   * @returns The newly created {@link SearchEntity} as persisted by the backend.
   * @note The `uniqueId` is part of the URL path (`/entities/{uniqueId}/register/`), not the request body.
   */
  register(uniqueId: string, data: RegisterEntityRequest): Promise<SearchEntity>;

  /**
   * Update an existing search entity.
   * @param uniqueId - The unique identifier of the entity to update.
   * @param data - The fields to update. All fields are optional.
   * @returns The updated {@link SearchEntity}.
   * @note Uses PUT (not PATCH) for the update request.
   */
  update(uniqueId: string, data: UpdateEntityRequest): Promise<SearchEntity>;

  /**
   * Delete a search entity by its unique ID.
   * @param uniqueId - The unique identifier of the entity to delete.
   * @returns Resolves with no value on successful deletion.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List all available entity types.
   * @returns An array of objects each containing an `entityType` string.
   * @note Returns an empty array if the backend response is not an array.
   */
  listEntityTypes(): Promise<{ entityType: string }[]>;

  /**
   * Get the schema definition for a specific entity type.
   * @param entityType - The entity type identifier to retrieve the schema for.
   * @returns The {@link EntityTypeSchema} containing field definitions and metadata for the given type.
   */
  getEntityTypeSchema(entityType: string): Promise<EntityTypeSchema>;

  /**
   * Search entities using AI copilot-assisted search.
   * @param data - The copilot search request containing a query string, optional entity type filters, and limit.
   * @returns An array of {@link SearchEntity} items matching the copilot query.
   */
  searchByCopilot(data: CopilotSearchRequest): Promise<SearchEntity[]>;
}

export function createEntitiesService(transport: Transport, _config: { apiKey: string }): EntitiesService {
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
