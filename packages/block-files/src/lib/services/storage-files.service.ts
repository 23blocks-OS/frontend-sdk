import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  StorageFile,
  CreateStorageFileRequest,
  UpdateStorageFileRequest,
  ListStorageFilesParams,
  StoragePresignUploadRequest,
  StoragePresignUploadResponse,
} from '../types/storage-file.js';
import { storageFileMapper } from '../mappers/storage-file.mapper.js';

export interface StorageFilesService {
  /**
   * List storage files for a company
   * @param urlId - The company's url_id (tenant identifier)
   * @param params - Optional filtering and pagination
   * @returns Paginated result containing StorageFile items and metadata
   */
  list(urlId: string, params?: ListStorageFilesParams): Promise<PageResult<StorageFile>>;

  /**
   * Get a specific storage file
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file
   * @returns The matching StorageFile record
   */
  get(urlId: string, fileUniqueId: string): Promise<StorageFile>;

  /**
   * Get a presigned URL for direct S3 upload
   * @param urlId - The company's url_id (tenant identifier)
   * @param data - Upload metadata including file name
   * @returns Presigned upload URL, public URL, file id, and expiration
   */
  presignUpload(urlId: string, data: StoragePresignUploadRequest): Promise<StoragePresignUploadResponse>;

  /**
   * Register an uploaded file in storage
   * @param urlId - The company's url_id (tenant identifier)
   * @param data - File metadata including name, type, size, and content URL
   * @returns The newly created StorageFile record
   */
  create(urlId: string, data: CreateStorageFileRequest): Promise<StorageFile>;

  /**
   * Update storage file metadata
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file to update
   * @param data - Fields to update
   * @returns The updated StorageFile record
   */
  update(urlId: string, fileUniqueId: string, data: UpdateStorageFileRequest): Promise<StorageFile>;

  /**
   * Delete a storage file (soft-delete)
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file to delete
   * @returns Resolves when the file has been deleted
   */
  delete(urlId: string, fileUniqueId: string): Promise<void>;

  /**
   * Approve a storage file (status: review -> active)
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file
   * @returns The updated StorageFile record with approved status
   */
  approve(urlId: string, fileUniqueId: string): Promise<StorageFile>;

  /**
   * Reject a storage file (status -> review)
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file
   * @returns The updated StorageFile record with rejected status
   */
  reject(urlId: string, fileUniqueId: string): Promise<StorageFile>;

  /**
   * Publish a storage file (copy to public bucket)
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file
   * @returns Resolves when the file has been published
   */
  publish(urlId: string, fileUniqueId: string): Promise<void>;

  /**
   * Unpublish a storage file (remove from public bucket)
   * @param urlId - The company's url_id (tenant identifier)
   * @param fileUniqueId - The unique identifier of the storage file
   * @returns Resolves when the file has been unpublished
   */
  unpublish(urlId: string, fileUniqueId: string): Promise<void>;
}

export function createStorageFilesService(transport: Transport, _config: { apiKey: string }): StorageFilesService {
  return {
    async list(urlId: string, params?: ListStorageFilesParams): Promise<PageResult<StorageFile>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.ext) queryParams['ext'] = params.ext;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.mimeType) queryParams['mime_type'] = params.mimeType;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/storage/${urlId}/files`, { params: queryParams });
      return decodePageResult(response, storageFileMapper);
    },

    async get(urlId: string, fileUniqueId: string): Promise<StorageFile> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.get<unknown>(`/storage/${urlId}/files/${fileUniqueId}`);
      return decodeOne(response, storageFileMapper);
    },

    async presignUpload(urlId: string, data: StoragePresignUploadRequest): Promise<StoragePresignUploadResponse> {
      const response = await transport.put<{
        data: {
          attributes: {
            presigned_url: string;
            signed_url: string;
            public_url: string;
            file_name: string;
            file_id: string;
            expires_at: string;
          };
        };
      }>(`/storage/${urlId}/presign_upload`, undefined, {
        params: {
          filename: data.fileName,
          serialization: 'jsonapi',
        },
      });
      const attrs = response.data.attributes;
      return {
        presignedUrl: attrs.presigned_url,
        signedUrl: attrs.signed_url,
        publicUrl: attrs.public_url,
        fileName: attrs.file_name,
        fileId: attrs.file_id,
        expiresAt: new Date(attrs.expires_at),
      };
    },

    async create(urlId: string, data: CreateStorageFileRequest): Promise<StorageFile> {
      const response = await transport.post<unknown>(`/storage/${urlId}/files`, {
        file: {
          name: data.name,
          file_type: data.fileType,
          file_size: data.fileSize,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          description: data.description,
          original_name: data.originalName,
          original_file: data.originalFile,
          virtual_folder: data.virtualFolder,
          category_name: data.categoryName,
          category_unique_id: data.categoryUniqueId,
          is_public: data.isPublic,
          access_level: data.accessLevel,
          ai_enabled: data.aiEnabled,
          is_temp: data.isTemp,
          raw_content: data.rawContent,
          content: data.content,
          file_structure: data.fileStructure,
          metadata: data.metadata,
          structured_content: data.structuredContent,
          schema_model: data.schemaModel,
          vectorDB: data.vectorDB,
          is_expirable: data.isExpirable,
          issued_at: data.issuedAt,
          expires_at: data.expiresAt,
          issued_by: data.issuedBy,
          tags: data.tags,
        },
      });
      return decodeOne(response, storageFileMapper);
    },

    async update(urlId: string, fileUniqueId: string, data: UpdateStorageFileRequest): Promise<StorageFile> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.put<unknown>(`/storage/${urlId}/files/${fileUniqueId}`, {
        file: {
          name: data.name,
          file_type: data.fileType,
          file_size: data.fileSize,
          url: data.url,
          thumbnail_url: data.thumbnailUrl,
          media_url: data.mediaUrl,
          image_url: data.imageUrl,
          content_url: data.contentUrl,
          description: data.description,
          original_name: data.originalName,
          original_file: data.originalFile,
          virtual_folder: data.virtualFolder,
          category_name: data.categoryName,
          category_unique_id: data.categoryUniqueId,
          is_public: data.isPublic,
          access_level: data.accessLevel,
          ai_enabled: data.aiEnabled,
          is_temp: data.isTemp,
          raw_content: data.rawContent,
          content: data.content,
          file_structure: data.fileStructure,
          metadata: data.metadata,
          structured_content: data.structuredContent,
          schema_model: data.schemaModel,
          vectorDB: data.vectorDB,
          is_expirable: data.isExpirable,
          issued_at: data.issuedAt,
          expires_at: data.expiresAt,
          issued_by: data.issuedBy,
          tags: data.tags,
        },
      });
      return decodeOne(response, storageFileMapper);
    },

    async delete(urlId: string, fileUniqueId: string): Promise<void> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      await transport.delete(`/storage/${urlId}/files/${fileUniqueId}`);
    },

    async approve(urlId: string, fileUniqueId: string): Promise<StorageFile> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.put<unknown>(`/storage/${urlId}/files/${fileUniqueId}/approve`, {});
      return decodeOne(response, storageFileMapper);
    },

    async reject(urlId: string, fileUniqueId: string): Promise<StorageFile> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      const response = await transport.put<unknown>(`/storage/${urlId}/files/${fileUniqueId}/reject`, {});
      return decodeOne(response, storageFileMapper);
    },

    async publish(urlId: string, fileUniqueId: string): Promise<void> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      await transport.put<unknown>(`/storage/${urlId}/files/${fileUniqueId}/publish`, {});
    },

    async unpublish(urlId: string, fileUniqueId: string): Promise<void> {
      assertUuid(fileUniqueId, 'fileUniqueId');
      await transport.put<unknown>(`/storage/${urlId}/files/${fileUniqueId}/unpublish`, {});
    },
  };
}
