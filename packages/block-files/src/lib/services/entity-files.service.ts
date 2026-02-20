import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EntityFile,
  AttachFileRequest,
  UpdateEntityFileRequest,
  ListEntityFilesParams,
  ReorderFilesRequest,
} from '../types/entity-file.js';
import { entityFileMapper } from '../mappers/entity-file.mapper.js';

export interface EntityFilesService {
  /**
   * List all entity-file associations
   * @param params - Optional filtering by entity, file type, status, and pagination
   * @returns Paginated result containing EntityFile items and metadata
   */
  list(params?: ListEntityFilesParams): Promise<PageResult<EntityFile>>;

  /**
   * Get a specific entity-file association
   * @param uniqueId - The unique identifier of the entity-file record
   * @returns The matching EntityFile record
   */
  get(uniqueId: string): Promise<EntityFile>;

  /**
   * Attach a file to an entity
   * @param data - Association details including entity and file identifiers
   * @returns The newly created EntityFile association
   */
  attach(data: AttachFileRequest): Promise<EntityFile>;

  /**
   * Detach a file from an entity
   * @param uniqueId - The unique identifier of the entity-file record to remove
   * @returns Resolves when the association has been removed
   */
  detach(uniqueId: string): Promise<void>;

  /**
   * Update an entity-file association
   * @param uniqueId - The unique identifier of the entity-file record
   * @param data - Fields to update such as display order or status
   * @returns The updated EntityFile record
   */
  update(uniqueId: string, data: UpdateEntityFileRequest): Promise<EntityFile>;

  /**
   * Reorder files attached to an entity
   * @param entityUniqueId - The unique identifier of the parent entity
   * @param entityType - The type of the parent entity
   * @param data - The new ordering specification for attached files
   * @returns Array of EntityFile records reflecting the new order
   */
  reorder(entityUniqueId: string, entityType: string, data: ReorderFilesRequest): Promise<EntityFile[]>;

  /**
   * List files attached to a specific entity
   * @param entityUniqueId - The unique identifier of the parent entity
   * @param entityType - The type of the parent entity
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of EntityFile records for the given entity
   */
  listByEntity(entityUniqueId: string, entityType: string, params?: ListEntityFilesParams): Promise<PageResult<EntityFile>>;
}

export function createEntityFilesService(transport: Transport, _config: { apiKey: string }): EntityFilesService {
  return {
    async list(params?: ListEntityFilesParams): Promise<PageResult<EntityFile>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.entityUniqueId) queryParams['entity_unique_id'] = params.entityUniqueId;
      if (params?.entityType) queryParams['entity_type'] = params.entityType;
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entity_files', { params: queryParams });
      return decodePageResult(response, entityFileMapper);
    },

    async get(uniqueId: string): Promise<EntityFile> {
      const response = await transport.get<unknown>(`/entity_files/${uniqueId}`);
      return decodeOne(response, entityFileMapper);
    },

    async attach(data: AttachFileRequest): Promise<EntityFile> {
      const response = await transport.post<unknown>('/entity_files', {
        file: {
            entity_unique_id: data.entityUniqueId,
            entity_type: data.entityType,
            file_unique_id: data.fileUniqueId,
            display_order: data.displayOrder,
            payload: data.payload,
          },
      });
      return decodeOne(response, entityFileMapper);
    },

    async detach(uniqueId: string): Promise<void> {
      await transport.delete(`/entity_files/${uniqueId}`);
    },

    async update(uniqueId: string, data: UpdateEntityFileRequest): Promise<EntityFile> {
      const response = await transport.put<unknown>(`/entity_files/${uniqueId}`, {
        file: {
            display_order: data.displayOrder,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, entityFileMapper);
    },

    async reorder(entityUniqueId: string, entityType: string, data: ReorderFilesRequest): Promise<EntityFile[]> {
      const response = await transport.put<unknown>('/entity_files/reorder', {
        file: {
            entity_unique_id: entityUniqueId,
            entity_type: entityType,
            file_orders: data.fileOrders,
          },
      });
      return decodeMany(response, entityFileMapper);
    },

    async listByEntity(entityUniqueId: string, entityType: string, params?: ListEntityFilesParams): Promise<PageResult<EntityFile>> {
      const queryParams: Record<string, string> = {
        entity_unique_id: entityUniqueId,
        entity_type: entityType,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entity_files', { params: queryParams });
      return decodePageResult(response, entityFileMapper);
    },
  };
}
