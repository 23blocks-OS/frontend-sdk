import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EntityFile,
  EntityIdentity,
  RegisterEntityRequest,
  CreateEntityFileRequest,
  UpdateEntityFileRequest,
  ListEntityFilesParams,
  AssociateFileRequest,
  EntityPresignUploadRequest,
  EntityPresignUploadResponse,
  EntityMultipartPresignRequest,
  EntityMultipartPresignResponse,
  EntityMultipartCompleteRequest,
  EntityMultipartCompleteResponse,
} from '../types/entity-file.js';
import { entityFileMapper } from '../mappers/entity-file.mapper.js';

export interface EntityFilesService {
  // ---- Entity management ----

  /**
   * List all registered entities
   * @returns Array of EntityIdentity records
   */
  listEntities(): Promise<EntityIdentity[]>;

  /**
   * Get a specific entity
   * @param entityUniqueId - The unique identifier of the entity
   * @returns The matching EntityIdentity record
   */
  getEntity(entityUniqueId: string): Promise<EntityIdentity>;

  /**
   * Register a new entity for file management
   * @param entityUniqueId - The unique identifier to register
   * @param data - Entity details including alias, type, and name
   * @returns The newly registered EntityIdentity record
   */
  registerEntity(entityUniqueId: string, data: RegisterEntityRequest): Promise<EntityIdentity>;

  // ---- File CRUD ----

  /**
   * List files for an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param params - Optional filtering and pagination
   * @returns Paginated result containing EntityFile items and metadata
   */
  list(entityUniqueId: string, params?: ListEntityFilesParams): Promise<PageResult<EntityFile>>;

  /**
   * Get a specific entity file
   * @param entityUniqueId - The unique identifier of the entity
   * @param fileUniqueId - The unique identifier of the file
   * @returns The matching EntityFile record
   */
  get(entityUniqueId: string, fileUniqueId: string): Promise<EntityFile>;

  /**
   * Register an uploaded file for an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param data - File metadata including name, type, size, and URL
   * @returns The newly created EntityFile record
   */
  create(entityUniqueId: string, data: CreateEntityFileRequest): Promise<EntityFile>;

  /**
   * Update entity file metadata
   * @param entityUniqueId - The unique identifier of the entity
   * @param fileUniqueId - The unique identifier of the file to update
   * @param data - Fields to update
   * @returns The updated EntityFile record
   */
  update(entityUniqueId: string, fileUniqueId: string, data: UpdateEntityFileRequest): Promise<EntityFile>;

  /**
   * Delete an entity file
   * @param entityUniqueId - The unique identifier of the entity
   * @param fileUniqueId - The unique identifier of the file to delete
   * @returns Resolves when the file has been deleted
   */
  delete(entityUniqueId: string, fileUniqueId: string): Promise<void>;

  // ---- Upload ----

  /**
   * Get a presigned URL for direct upload to an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param data - Upload metadata including file name
   * @returns Signed URL and public URL for the upload
   */
  presignUpload(entityUniqueId: string, data: EntityPresignUploadRequest): Promise<EntityPresignUploadResponse>;

  /**
   * Get presigned URLs for multipart upload to an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param data - Upload metadata including file name and part count
   * @returns Upload ID and array of part-level presigned URLs
   */
  multipartPresign(entityUniqueId: string, data: EntityMultipartPresignRequest): Promise<EntityMultipartPresignResponse>;

  /**
   * Complete a multipart upload for an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param data - Completion data including file name, upload ID, and part ETags
   * @returns Confirmation with public URL and file name
   */
  multipartComplete(entityUniqueId: string, data: EntityMultipartCompleteRequest): Promise<EntityMultipartCompleteResponse>;

  // ---- Association ----

  /**
   * Associate an existing file with an entity (cross-entity sharing)
   * @param entityUniqueId - The unique identifier of the entity
   * @param data - Association details including file id and optional source entity
   * @returns The newly created EntityFile association
   */
  associate(entityUniqueId: string, data: AssociateFileRequest): Promise<EntityFile>;

  /**
   * Remove a file association from an entity
   * @param entityUniqueId - The unique identifier of the entity
   * @param fileUniqueId - The unique identifier of the file
   * @returns Resolves when the association has been removed
   */
  disassociate(entityUniqueId: string, fileUniqueId: string): Promise<void>;
}

export function createEntityFilesService(transport: Transport, _config: { apiKey: string }): EntityFilesService {
  const mapEntityIdentity = (item: Record<string, unknown>): EntityIdentity => {
    const attrs = (item['attributes'] ?? item) as Record<string, unknown>;
    return {
      id: String(item['id'] ?? attrs['unique_id'] ?? ''),
      uniqueId: String(attrs['unique_id'] ?? ''),
      entityAlias: attrs['entity_alias'] as string | undefined,
      entityType: attrs['entity_type'] as string | undefined,
      name: attrs['name'] as string | undefined,
      createdAt: attrs['created_at'] ? new Date(attrs['created_at'] as string) : undefined,
      updatedAt: attrs['updated_at'] ? new Date(attrs['updated_at'] as string) : undefined,
    };
  };

  return {
    async listEntities(): Promise<EntityIdentity[]> {
      const response = await transport.get<{ data: Array<Record<string, unknown>> }>('/entities');
      return (response.data || []).map(mapEntityIdentity);
    },

    async getEntity(entityUniqueId: string): Promise<EntityIdentity> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.get<{ data: Record<string, unknown> }>(`/entities/${entityUniqueId}`);
      return mapEntityIdentity(response.data);
    },

    async registerEntity(entityUniqueId: string, data: RegisterEntityRequest): Promise<EntityIdentity> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.post<{ data: Record<string, unknown> }>(`/entities/${entityUniqueId}/register`, {
        entity: {
          entity_alias: data.entityAlias,
          entity_type: data.entityType,
          name: data.name,
        },
      });
      return mapEntityIdentity(response.data);
    },

    async list(entityUniqueId: string, params?: ListEntityFilesParams): Promise<PageResult<EntityFile>> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/entities/${entityUniqueId}/files`, { params: queryParams });
      return decodePageResult(response, entityFileMapper);
    },

    async get(entityUniqueId: string, fileUniqueId: string): Promise<EntityFile> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.get<unknown>(`/entities/${entityUniqueId}/files/${fileUniqueId}`);
      return decodeOne(response, entityFileMapper);
    },

    async create(entityUniqueId: string, data: CreateEntityFileRequest): Promise<EntityFile> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.post<unknown>(`/entities/${entityUniqueId}/files`, {
        file: {
          name: data.name,
          original_name: data.originalName,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          file_type: data.fileType,
          file_size: data.fileSize,
          description: data.description,
        },
      });
      return decodeOne(response, entityFileMapper);
    },

    async update(entityUniqueId: string, fileUniqueId: string, data: UpdateEntityFileRequest): Promise<EntityFile> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.put<unknown>(`/entities/${entityUniqueId}/files/${fileUniqueId}`, {
        file: {
          name: data.name,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          content_url: data.contentUrl,
          image_url: data.imageUrl,
          file_type: data.fileType,
          file_size: data.fileSize,
          description: data.description,
        },
      });
      return decodeOne(response, entityFileMapper);
    },

    async delete(entityUniqueId: string, fileUniqueId: string): Promise<void> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      assertUuid(fileUniqueId, 'fileUniqueId');
      await transport.delete(`/entities/${entityUniqueId}/files/${fileUniqueId}`);
    },

    async presignUpload(entityUniqueId: string, data: EntityPresignUploadRequest): Promise<EntityPresignUploadResponse> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.put<{
        signed_url: string;
        public_url: string;
      }>(`/entities/${entityUniqueId}/presign`, undefined, {
        params: {
          filename: data.fileName,
        },
      });
      return {
        signedUrl: response.signed_url,
        publicUrl: response.public_url,
      };
    },

    async multipartPresign(entityUniqueId: string, data: EntityMultipartPresignRequest): Promise<EntityMultipartPresignResponse> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.post<{
        upload_id: string;
        presigned_urls: string[];
      }>(`/entities/${entityUniqueId}/multipart_presign_upload`, {
        filename: data.fileName,
        part_count: data.partCount,
      });
      return {
        uploadId: response.upload_id,
        parts: response.presigned_urls.map((url, idx) => ({
          partNumber: idx + 1,
          presignedUrl: url,
        })),
      };
    },

    async multipartComplete(entityUniqueId: string, data: EntityMultipartCompleteRequest): Promise<EntityMultipartCompleteResponse> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.post<{
        public_url: string;
        file_name: string;
      }>(`/entities/${entityUniqueId}/multipart_complete_upload`, {
        filename: data.fileName,
        upload_id: data.uploadId,
        parts: data.parts.map((p) => ({
          ETag: p.etag,
          PartNumber: p.partNumber,
        })),
      });
      return {
        publicUrl: response.public_url,
        fileName: response.file_name,
      };
    },

    async associate(entityUniqueId: string, data: AssociateFileRequest): Promise<EntityFile> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      const response = await transport.post<unknown>(`/entities/${entityUniqueId}/files/associate`, {
        file_unique_id: data.fileUniqueId,
        association_type: data.associationType,
        source_entity_id: data.sourceEntityId,
      });
      return decodeOne(response, entityFileMapper);
    },

    async disassociate(entityUniqueId: string, fileUniqueId: string): Promise<void> {
      assertUuid(entityUniqueId, 'entityUniqueId');
      assertUuid(fileUniqueId, 'fileUniqueId');
      await transport.delete(`/entities/${entityUniqueId}/files/${fileUniqueId}/disassociate`);
    },
  };
}
