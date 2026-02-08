import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileSchema,
  CreateFileSchemaRequest,
  UpdateFileSchemaRequest,
  ListFileSchemasParams,
} from '../types/file-schema.js';
import { fileSchemaMapper } from '../mappers/file-schema.mapper.js';

export interface FileSchemasService {
  /**
   * List all file schemas
   * @param params - Optional filtering by status, search term, and pagination
   * @returns Paginated result containing FileSchema items and metadata
   */
  list(params?: ListFileSchemasParams): Promise<PageResult<FileSchema>>;

  /**
   * Get a specific file schema by unique identifier
   * @param uniqueId - The unique identifier of the file schema
   * @returns The matching FileSchema record
   */
  get(uniqueId: string): Promise<FileSchema>;

  /**
   * Get a file schema by its code
   * @param code - The unique code identifying the file schema
   * @returns The matching FileSchema record
   */
  getByCode(code: string): Promise<FileSchema>;

  /**
   * Create a new file schema
   * @param data - Schema details including code, name, MIME types, and file size constraints
   * @returns The newly created FileSchema record
   */
  create(data: CreateFileSchemaRequest): Promise<FileSchema>;

  /**
   * Update an existing file schema
   * @param uniqueId - The unique identifier of the schema to update
   * @param data - Fields to update such as name, allowed MIME types, or constraints
   * @returns The updated FileSchema record
   */
  update(uniqueId: string, data: UpdateFileSchemaRequest): Promise<FileSchema>;

  /**
   * Delete a file schema
   * @param uniqueId - The unique identifier of the schema to delete
   * @returns Resolves when the schema has been deleted
   */
  delete(uniqueId: string): Promise<void>;
}

export function createFileSchemasService(transport: Transport, _config: { appId: string }): FileSchemasService {
  return {
    async list(params?: ListFileSchemasParams): Promise<PageResult<FileSchema>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_schemas', { params: queryParams });
      return decodePageResult(response, fileSchemaMapper);
    },

    async get(uniqueId: string): Promise<FileSchema> {
      const response = await transport.get<unknown>(`/file_schemas/${uniqueId}`);
      return decodeOne(response, fileSchemaMapper);
    },

    async getByCode(code: string): Promise<FileSchema> {
      const response = await transport.get<unknown>(`/file_schemas/code/${code}`);
      return decodeOne(response, fileSchemaMapper);
    },

    async create(data: CreateFileSchemaRequest): Promise<FileSchema> {
      const response = await transport.post<unknown>('/file_schemas', {
        file_schema: {
            code: data.code,
            name: data.name,
            description: data.description,
            allowed_mime_types: data.allowedMimeTypes,
            max_file_size: data.maxFileSize,
            required: data.required,
            multiple: data.multiple,
            payload: data.payload,
          },
      });
      return decodeOne(response, fileSchemaMapper);
    },

    async update(uniqueId: string, data: UpdateFileSchemaRequest): Promise<FileSchema> {
      const response = await transport.put<unknown>(`/file_schemas/${uniqueId}`, {
        file_schema: {
            name: data.name,
            description: data.description,
            allowed_mime_types: data.allowedMimeTypes,
            max_file_size: data.maxFileSize,
            required: data.required,
            multiple: data.multiple,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, fileSchemaMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/file_schemas/${uniqueId}`);
    },
  };
}
