import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  StorageFile,
  CreateStorageFileRequest,
  UpdateStorageFileRequest,
  ListStorageFilesParams,
  UploadFileRequest,
} from '../types/storage-file.js';
import { storageFileMapper } from '../mappers/storage-file.mapper.js';

export interface StorageFilesService {
  /**
   * List all storage files
   * @param params - Optional filtering by owner, file/MIME type, status, and pagination
   * @returns Paginated result containing StorageFile items and metadata
   */
  list(params?: ListStorageFilesParams): Promise<PageResult<StorageFile>>;

  /**
   * Get a specific storage file
   * @param uniqueId - The unique identifier of the storage file
   * @returns The matching StorageFile record
   */
  get(uniqueId: string): Promise<StorageFile>;

  /**
   * Upload a file using multipart form data
   * @param data - Upload payload including the File object, owner info, and optional processing flags
   * @returns The newly created StorageFile record
   * @note Sends the request as multipart/form-data with the file binary
   */
  upload(data: UploadFileRequest): Promise<StorageFile>;

  /**
   * Create a storage file record from metadata (without binary upload)
   * @param data - File metadata including owner, name, type, size, and content URL
   * @returns The newly created StorageFile record
   * @note Use this when the file binary is already hosted externally
   */
  create(data: CreateStorageFileRequest): Promise<StorageFile>;

  /**
   * Update an existing storage file record
   * @param uniqueId - The unique identifier of the storage file to update
   * @param data - Fields to update such as file name, URLs, or status
   * @returns The updated StorageFile record
   */
  update(uniqueId: string, data: UpdateStorageFileRequest): Promise<StorageFile>;

  /**
   * Delete a storage file
   * @param uniqueId - The unique identifier of the storage file to delete
   * @returns Resolves when the file has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Download a storage file as a binary Blob
   * @param uniqueId - The unique identifier of the storage file to download
   * @returns The file contents as a Blob
   */
  download(uniqueId: string): Promise<Blob>;

  /**
   * List storage files belonging to a specific owner
   * @param ownerUniqueId - The unique identifier of the owner
   * @param ownerType - The type of owner entity
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of StorageFile records for the given owner
   */
  listByOwner(ownerUniqueId: string, ownerType: string, params?: ListStorageFilesParams): Promise<PageResult<StorageFile>>;
}

export function createStorageFilesService(transport: Transport, _config: { apiKey: string }): StorageFilesService {
  return {
    async list(params?: ListStorageFilesParams): Promise<PageResult<StorageFile>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.ownerUniqueId) queryParams['owner_unique_id'] = params.ownerUniqueId;
      if (params?.ownerType) queryParams['owner_type'] = params.ownerType;
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.mimeType) queryParams['mime_type'] = params.mimeType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/storage_files', { params: queryParams });
      return decodePageResult(response, storageFileMapper);
    },

    async get(uniqueId: string): Promise<StorageFile> {
      const response = await transport.get<unknown>(`/storage_files/${uniqueId}`);
      return decodeOne(response, storageFileMapper);
    },

    async upload(data: UploadFileRequest): Promise<StorageFile> {
      const formData = new FormData();
      formData.append('file', data.file, data.fileName);
      formData.append('owner_unique_id', data.ownerUniqueId);
      formData.append('owner_type', data.ownerType);

      if (data.fileType) formData.append('file_type', data.fileType);
      if (data.generateThumbnail !== undefined) formData.append('generate_thumbnail', String(data.generateThumbnail));
      if (data.generatePreview !== undefined) formData.append('generate_preview', String(data.generatePreview));
      if (data.payload) formData.append('payload', JSON.stringify(data.payload));
      if (data.tags) formData.append('tags', JSON.stringify(data.tags));

      const response = await transport.post<unknown>('/storage_files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return decodeOne(response, storageFileMapper);
    },

    async create(data: CreateStorageFileRequest): Promise<StorageFile> {
      const response = await transport.post<unknown>('/storage_files', {
        file: {
            owner_unique_id: data.ownerUniqueId,
            owner_type: data.ownerType,
            file_name: data.fileName,
            file_type: data.fileType,
            file_size: data.fileSize,
            mime_type: data.mimeType,
            content_url: data.contentUrl,
            storage_path: data.storagePath,
            storage_provider: data.storageProvider,
            payload: data.payload,
            tags: data.tags,
          },
      });
      return decodeOne(response, storageFileMapper);
    },

    async update(uniqueId: string, data: UpdateStorageFileRequest): Promise<StorageFile> {
      const response = await transport.put<unknown>(`/storage_files/${uniqueId}`, {
        file: {
            file_name: data.fileName,
            file_type: data.fileType,
            content_url: data.contentUrl,
            thumbnail_url: data.thumbnailUrl,
            preview_url: data.previewUrl,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
            tags: data.tags,
          },
      });
      return decodeOne(response, storageFileMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/storage_files/${uniqueId}`);
    },

    async download(uniqueId: string): Promise<Blob> {
      const response = await transport.get<Blob>(`/storage_files/${uniqueId}/download`, {
        headers: { Accept: 'application/octet-stream' },
      });
      return response;
    },

    async listByOwner(ownerUniqueId: string, ownerType: string, params?: ListStorageFilesParams): Promise<PageResult<StorageFile>> {
      const queryParams: Record<string, string> = {
        owner_unique_id: ownerUniqueId,
        owner_type: ownerType,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.fileType) queryParams['file_type'] = params.fileType;
      if (params?.mimeType) queryParams['mime_type'] = params.mimeType;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/storage_files', { params: queryParams });
      return decodePageResult(response, storageFileMapper);
    },
  };
}
