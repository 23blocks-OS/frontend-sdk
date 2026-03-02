import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileAccess,
  CreateFileAccessRequest,
  UpdateFileAccessRequest,
  ListFileAccessParams,
} from '../types/file-access.js';
import { fileAccessMapper } from '../mappers/file-access.mapper.js';

export interface FileAccessService {
  /**
   * List all file access grants
   * @param params - Optional filtering by file, grantee, access level, status, and pagination
   * @returns Paginated result containing FileAccess items and metadata
   */
  list(params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;

  /**
   * Get a specific file access grant
   * @param uniqueId - The unique identifier of the access grant
   * @returns The matching FileAccess record
   */
  get(uniqueId: string): Promise<FileAccess>;

  /**
   * Grant file access to a user
   * @param data - Access grant details including user, access type, and optional expiry
   * @returns The newly created FileAccess record
   */
  grant(data: CreateFileAccessRequest): Promise<FileAccess>;

  /**
   * Update an existing file access grant
   * @param uniqueId - The unique identifier of the access grant to update
   * @param data - Fields to update such as access type, expiration, or start date
   * @returns The updated FileAccess record
   */
  update(uniqueId: string, data: UpdateFileAccessRequest): Promise<FileAccess>;

  /**
   * Revoke a file access grant
   * @param uniqueId - The unique identifier of the access grant to revoke
   * @returns Resolves when the access grant has been revoked
   */
  revoke(uniqueId: string): Promise<void>;

  /**
   * List all access grants for a specific file
   * @param fileUniqueId - The unique identifier of the file
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of FileAccess records for the given file
   */
  listByFile(fileUniqueId: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;

  /**
   * List all access grants for a specific grantee
   * @param granteeUniqueId - The unique identifier of the grantee
   * @param granteeType - The type of grantee (e.g., user, group)
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result of FileAccess records for the given grantee
   */
  listByGrantee(granteeUniqueId: string, granteeType: string, params?: ListFileAccessParams): Promise<PageResult<FileAccess>>;

  /**
   * Check whether a grantee has access to a specific file
   * @param fileUniqueId - The unique identifier of the file
   * @param granteeUniqueId - The unique identifier of the grantee
   * @returns The FileAccess record if access exists, or null if no access is granted
   * @note Returns null instead of throwing when no access record is found
   */
  checkAccess(fileUniqueId: string, granteeUniqueId: string): Promise<FileAccess | null>;
}

export function createFileAccessService(transport: Transport, _config: { apiKey: string }): FileAccessService {
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
        access: {
          user_unique_id: data.userUniqueId,
          access_type: data.accessType,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
          user_unique_ids: data.userUniqueIds,
        },
      });
      return decodeOne(response, fileAccessMapper);
    },

    async update(uniqueId: string, data: UpdateFileAccessRequest): Promise<FileAccess> {
      const response = await transport.put<unknown>(`/file_accesses/${uniqueId}`, {
        access: {
          access_type: data.accessType,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
          user_unique_id: data.userUniqueId,
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
