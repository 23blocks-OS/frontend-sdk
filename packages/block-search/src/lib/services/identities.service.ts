import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  SearchIdentity,
  RegisterIdentityRequest,
  UpdateIdentityRequest,
  ListIdentitiesParams,
} from '../types/identity.js';
import { searchIdentityMapper } from '../mappers/identity.mapper.js';

export interface IdentitiesService {
  list(params?: ListIdentitiesParams): Promise<PageResult<SearchIdentity>>;
  get(uniqueId: string): Promise<SearchIdentity>;
  register(uniqueId: string, data: RegisterIdentityRequest): Promise<SearchIdentity>;
  update(uniqueId: string, data: UpdateIdentityRequest): Promise<SearchIdentity>;
}

export function createIdentitiesService(transport: Transport, _config: { appId: string }): IdentitiesService {
  return {
    async list(params?: ListIdentitiesParams): Promise<PageResult<SearchIdentity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/identities/', { params: queryParams });
      return decodePageResult(response, searchIdentityMapper);
    },

    async get(uniqueId: string): Promise<SearchIdentity> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/`);
      return decodeOne(response, searchIdentityMapper);
    },

    async register(uniqueId: string, data: RegisterIdentityRequest): Promise<SearchIdentity> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/register/`, {
        identity: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          avatar_url: data.avatarUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, searchIdentityMapper);
    },

    async update(uniqueId: string, data: UpdateIdentityRequest): Promise<SearchIdentity> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}/`, {
        identity: {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          avatar_url: data.avatarUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, searchIdentityMapper);
    },
  };
}
