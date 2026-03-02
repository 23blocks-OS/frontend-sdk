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
  /**
   * List search identities with optional filtering, pagination, and sorting.
   * @param params - Optional filtering, pagination, and sorting parameters.
   * @returns A paginated result containing an array of {@link SearchIdentity} items and pagination metadata.
   * @note The `perPage` param is sent as `records` to the backend API.
   * @note Sort order is expressed via a `-` prefix on the field name for descending (JSON:API convention).
   */
  list(params?: ListIdentitiesParams): Promise<PageResult<SearchIdentity>>;

  /**
   * Get a single search identity by its unique ID.
   * @param uniqueId - The unique identifier of the identity.
   * @returns The matching {@link SearchIdentity}.
   */
  get(uniqueId: string): Promise<SearchIdentity>;

  /**
   * Register a new search identity under a given unique ID.
   * @param uniqueId - The unique identifier to assign to the identity.
   * @param data - The identity registration payload including email, name fields, and optional avatar/payload.
   * @returns The newly created {@link SearchIdentity} as persisted by the backend.
   * @note The `uniqueId` is part of the URL path (`/identities/{uniqueId}/register/`), not the request body.
   */
  register(uniqueId: string, data: RegisterIdentityRequest): Promise<SearchIdentity>;

  /**
   * Update an existing search identity.
   * @param uniqueId - The unique identifier of the identity to update.
   * @param data - The fields to update. All fields are optional.
   * @returns The updated {@link SearchIdentity}.
   * @note Uses PUT (not PATCH) for the update request.
   */
  update(uniqueId: string, data: UpdateIdentityRequest): Promise<SearchIdentity>;
}

export function createIdentitiesService(transport: Transport, _config: { apiKey: string }): IdentitiesService {
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
        user: {
          name: data.name,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          role_id: data.roleId,
          role_name: data.roleName,
          role_unique_id: data.roleUniqueId,
          company_id: data.companyId,
          time_zone: data.timeZone,
          preferred_language: data.preferredLanguage,
          max_file_size: data.maxFileSize,
          max_storage: data.maxStorage,
        },
      });
      return decodeOne(response, searchIdentityMapper);
    },

    async update(uniqueId: string, data: UpdateIdentityRequest): Promise<SearchIdentity> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}/`, {
        user: {
          name: data.name,
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          role_id: data.roleId,
          role_name: data.roleName,
          role_unique_id: data.roleUniqueId,
          company_id: data.companyId,
          time_zone: data.timeZone,
          preferred_language: data.preferredLanguage,
          max_file_size: data.maxFileSize,
          max_storage: data.maxStorage,
        },
      });
      return decodeOne(response, searchIdentityMapper);
    },
  };
}
