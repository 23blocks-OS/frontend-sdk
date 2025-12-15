import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  IcsToken,
  CreateIcsTokenRequest,
  ListIcsTokensParams,
} from '../types/ics-token';
import { icsTokenMapper } from '../mappers/ics-token.mapper';

export interface IcsTokensService {
  list(userUniqueId: string, params?: ListIcsTokensParams): Promise<PageResult<IcsToken>>;
  create(userUniqueId: string, data: CreateIcsTokenRequest): Promise<IcsToken>;
  delete(userUniqueId: string, id: string): Promise<void>;
}

export function createIcsTokensService(transport: Transport, _config: { appId: string }): IcsTokensService {
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

    async delete(userUniqueId: string, id: string): Promise<void> {
      await transport.delete(`/users/${userUniqueId}/ics_tokens/${id}`);
    },
  };
}
