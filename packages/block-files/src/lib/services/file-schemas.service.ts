import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileSchema,
  CreateFileSchemaRequest,
  UpdateFileSchemaRequest,
  ListFileSchemasParams,
} from '../types/file-schema';
import { fileSchemaMapper } from '../mappers/file-schema.mapper';

export interface FileSchemasService {
  list(params?: ListFileSchemasParams): Promise<PageResult<FileSchema>>;
  get(uniqueId: string): Promise<FileSchema>;
  getByCode(code: string): Promise<FileSchema>;
  create(data: CreateFileSchemaRequest): Promise<FileSchema>;
  update(uniqueId: string, data: UpdateFileSchemaRequest): Promise<FileSchema>;
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
