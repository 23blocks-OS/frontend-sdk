import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
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
   * @param data - Delegation details including grantee, access type, and optional dates
   * @returns The newly created FileDelegation record
   */
  create(userUniqueId: string, data: CreateFileDelegationRequest): Promise<FileDelegation>;

  /**
   * Update an existing file delegation
   * @param userUniqueId - The unique identifier of the delegating user
   * @param uniqueId - The unique identifier of the delegation to update
   * @param data - Fields to update such as access type or dates
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

export function createDelegationsService(transport: Transport, _config: { apiKey: string }): DelegationsService {
  return {
    async list(userUniqueId: string, params?: ListFileDelegationsParams): Promise<PageResult<FileDelegation>> {
      assertUuid(userUniqueId, 'userUniqueId');
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
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/users/${userUniqueId}/delegations/${uniqueId}`);
      return decodeOne(response, fileDelegationMapper);
    },

    async create(userUniqueId: string, data: CreateFileDelegationRequest): Promise<FileDelegation> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.post<unknown>(`/users/${userUniqueId}/delegations`, {
        access: {
          grantee_user_unique_id: data.granteeUserUniqueId,
          access_type: data.accessType,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
        },
      });
      return decodeOne(response, fileDelegationMapper);
    },

    async update(userUniqueId: string, uniqueId: string, data: UpdateFileDelegationRequest): Promise<FileDelegation> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/users/${userUniqueId}/delegations/${uniqueId}`, {
        access: {
          access_type: data.accessType,
          grantee_user_unique_id: data.granteeUserUniqueId,
          expires_at: data.expiresAt,
          starts_at: data.startsAt,
        },
      });
      return decodeOne(response, fileDelegationMapper);
    },

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      assertUuid(userUniqueId, 'userUniqueId');
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/users/${userUniqueId}/delegations/${uniqueId}`);
    },

    async listReceivedDelegations(userUniqueId: string): Promise<FileDelegation[]> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.get<unknown>(`/users/${userUniqueId}/delegations/received`);
      return decodeMany(response, fileDelegationMapper);
    },
  };
}
