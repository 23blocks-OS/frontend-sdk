import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  FileDelegation,
  CreateFileDelegationRequest,
  UpdateFileDelegationRequest,
  ListFileDelegationsParams,
} from '../types/delegation.js';
import { fileDelegationMapper } from '../mappers/delegation.mapper.js';

export interface DelegationsService {
  /**
   * List all file delegations for a user
   * @param userUniqueId - The unique identifier of the delegating user
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated result containing FileDelegation items and metadata
   */
  list(userUniqueId: string, params?: ListFileDelegationsParams): Promise<PageResult<FileDelegation>>;

  /**
   * Get a specific file delegation
   * @param userUniqueId - The unique identifier of the delegating user
   * @param uniqueId - The unique identifier of the delegation
   * @returns The matching FileDelegation record
   */
  get(userUniqueId: string, uniqueId: string): Promise<FileDelegation>;

  /**
   * Create a new file delegation
   * @param userUniqueId - The unique identifier of the delegating user
   * @param data - Delegation details including delegatee, file/folder, and permissions
   * @returns The newly created FileDelegation record
   */
  create(userUniqueId: string, data: CreateFileDelegationRequest): Promise<FileDelegation>;

  /**
   * Update an existing file delegation
   * @param userUniqueId - The unique identifier of the delegating user
   * @param uniqueId - The unique identifier of the delegation to update
   * @param data - Fields to update such as permissions, expiration, or status
   * @returns The updated FileDelegation record
   */
  update(userUniqueId: string, uniqueId: string, data: UpdateFileDelegationRequest): Promise<FileDelegation>;

  /**
   * Delete a file delegation
   * @param userUniqueId - The unique identifier of the delegating user
   * @param uniqueId - The unique identifier of the delegation to delete
   * @returns Resolves when the delegation has been deleted
   */
  delete(userUniqueId: string, uniqueId: string): Promise<void>;

  /**
   * List delegations received by a user from other users
   * @param userUniqueId - The unique identifier of the receiving user
   * @returns Array of FileDelegation records where this user is the delegatee
   */
  listReceivedDelegations(userUniqueId: string): Promise<FileDelegation[]>;
}

export function createDelegationsService(transport: Transport, _config: { appId: string }): DelegationsService {
  return {
    async list(userUniqueId: string, params?: ListFileDelegationsParams): Promise<PageResult<FileDelegation>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.delegateeUniqueId) queryParams['delegatee_unique_id'] = params.delegateeUniqueId;
      if (params?.fileUniqueId) queryParams['file_unique_id'] = params.fileUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/delegations`, { params: queryParams });
      return decodePageResult(response, fileDelegationMapper);
    },

    async get(userUniqueId: string, uniqueId: string): Promise<FileDelegation> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/delegations/${uniqueId}`);
      return decodeOne(response, fileDelegationMapper);
    },

    async create(userUniqueId: string, data: CreateFileDelegationRequest): Promise<FileDelegation> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/delegations`, {
        delegation: {
          delegatee_unique_id: data.delegateeUniqueId,
          file_unique_id: data.fileUniqueId,
          folder_unique_id: data.folderUniqueId,
          permissions: data.permissions,
          expires_at: data.expiresAt,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileDelegationMapper);
    },

    async update(userUniqueId: string, uniqueId: string, data: UpdateFileDelegationRequest): Promise<FileDelegation> {
      const response = await transport.put<unknown>(`/users/${userUniqueId}/delegations/${uniqueId}`, {
        delegation: {
          permissions: data.permissions,
          expires_at: data.expiresAt,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, fileDelegationMapper);
    },

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/delegations/${uniqueId}`);
    },

    async listReceivedDelegations(userUniqueId: string): Promise<FileDelegation[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/delegations/received`);
      return decodeMany(response, fileDelegationMapper);
    },
  };
}
