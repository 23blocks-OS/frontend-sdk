import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  IcsToken,
  CreateIcsTokenRequest,
  ListIcsTokensParams,
} from '../types/ics-token.js';
import { icsTokenMapper } from '../mappers/ics-token.mapper.js';

export interface IcsTokensService {
  /**
   * List ICS tokens for a specific user with optional filtering, pagination, and sorting.
   * @param userUniqueId - The unique identifier of the user.
   * @param params - Optional filtering (status, search), pagination, and sorting parameters.
   * @returns Paginated result containing IcsToken objects and metadata.
   */
  list(userUniqueId: string, params?: ListIcsTokensParams): Promise<PageResult<IcsToken>>;

  /**
   * Create a new ICS token for a user, enabling calendar feed access.
   * @param userUniqueId - The unique identifier of the user.
   * @param data - The ICS token creation payload with name, description, and optional expiration.
   * @returns The newly created IcsToken object containing the generated token value.
   */
  create(userUniqueId: string, data: CreateIcsTokenRequest): Promise<IcsToken>;

  /**
   * Delete an ICS token for a user, revoking calendar feed access.
   * @param userUniqueId - The unique identifier of the user.
   * @param uniqueId - The unique identifier of the ICS token to delete.
   * @returns Resolves when the ICS token has been deleted.
   */
  delete(userUniqueId: string, uniqueId: string): Promise<void>;
}

export function createIcsTokensService(transport: Transport, _config: { apiKey: string }): IcsTokensService {
  return {
    async list(userUniqueId: string, params?: ListIcsTokensParams): Promise<PageResult<IcsToken>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/users/${userUniqueId}/ics_tokens`, { params: queryParams });
      return decodePageResult(response, icsTokenMapper);
    },

    async create(userUniqueId: string, data: CreateIcsTokenRequest): Promise<IcsToken> {
      const response = await transport.post<unknown>(`/users/${userUniqueId}/ics_tokens`, {
        ics_token: {
          name: data.name,
          description: data.description,
          expires_at: data.expiresAt?.toISOString(),
          payload: data.payload,
        },
      });
      return decodeOne(response, icsTokenMapper);
    },

    async delete(userUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/ics_tokens/${uniqueId}`);
    },
  };
}
