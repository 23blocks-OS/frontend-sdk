import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileAccess,
  CreateFileAccessRequest,
  UpdateFileAccessRequest,
  ListFileAccessParams,
} from '../types/file-access';
import { fileAccessMapper } from '../mappers/file-access.mapper';

export interface FileAccessService {
  list(params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;
  get(uniqueId: string): Promise<FileAccess>;
  grant(data: CreateFileAccessRequest): Promise<FileAccess>;
  update(uniqueId: string, data: UpdateFileAccessRequest): Promise<FileAccess>;
  revoke(uniqueId: string): Promise<void>;
  listByFile(fileUniqueId: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;
  listByGrantee(granteeUniqueId: string, granteeType: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;
  checkAccess(fileUniqueId: string, granteeUniqueId: string): Promise<FileAccess | null>;
}

export function createFileAccessService(transport: Transport, _config: { appId: string }): FileAccessService {
  return {
    async list(params?: ListFileAccessParams): Promise<PageResult<FileAccess>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.fileUniqueId) queryParams['file_unique_id'] = params.fileUniqueId;
      if (params?.granteeUniqueId) queryParams['grantee_unique_id'] = params.granteeUniqueId;
      if (params?.granteeType) queryParams['grantee_type'] = params.granteeType;
      if (params?.accessLevel) queryParams['access_level'] = params.accessLevel;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_accesses', { params: queryParams });
      return decodePageResult(response, fileAccessMapper);
    },

    async get(uniqueId: string): Promise<FileAccess> {
      const response = await transport.get<unknown>(`/file_accesses/${uniqueId}`);
      return decodeOne(response, fileAccessMapper);
    },

    async grant(data: CreateFileAccessRequest): Promise<FileAccess> {
      const response = await transport.post<unknown>('/file_accesses', {
        file_access: {
          file_unique_id: data.fileUniqueId,
          grantee_unique_id: data.granteeUniqueId,
          grantee_type: data.granteeType,
          access_level: data.accessLevel,
          expires_at: data.expiresAt,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileAccessMapper);
    },

    async update(uniqueId: string, data: UpdateFileAccessRequest): Promise<FileAccess> {
      const response = await transport.put<unknown>(`/file_accesses/${uniqueId}`, {
        file_access: {
          access_level: data.accessLevel,
          expires_at: data.expiresAt,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileAccessMapper);
    },

    async revoke(uniqueId: string): Promise<void> {
      await transport.delete(`/file_accesses/${uniqueId}`);
    },

    async listByFile(fileUniqueId: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>> {
      const queryParams: Record<string, string> = {
        file_unique_id: fileUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.accessLevel) queryParams['access_level'] = params.accessLevel;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_accesses', { params: queryParams });
      return decodePageResult(response, fileAccessMapper);
    },

    async listByGrantee(granteeUniqueId: string, granteeType: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>> {
      const queryParams: Record<string, string> = {
        grantee_unique_id: granteeUniqueId,
        grantee_type: granteeType,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.accessLevel) queryParams['access_level'] = params.accessLevel;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/file_accesses', { params: queryParams });
      return decodePageResult(response, fileAccessMapper);
    },

    async checkAccess(fileUniqueId: string, granteeUniqueId: string): Promise<FileAccess | null> {
      try {
        const response = await transport.get<unknown>('/file_accesses/check', {
          params: {
            file_unique_id: fileUniqueId,
            grantee_unique_id: granteeUniqueId,
          },
        });
        return decodeOne(response, fileAccessMapper);
      } catch {
        return null;
      }
    },
  };
}
