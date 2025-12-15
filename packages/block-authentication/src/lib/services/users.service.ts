import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { User, UserProfile } from '../types/index.js';
import { userMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * User update request
 */
export interface UpdateUserRequest {
  name?: string;
  username?: string;
  nickname?: string;
  bio?: string;
  roleId?: string;
  status?: string;
}

/**
 * Profile update request
 */
export interface UpdateProfileRequest {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  gender?: string;
  zipcode?: string;
  phoneNumber?: string;
  preferredLanguage?: string;
  timeZone?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  payload?: Record<string, unknown>;
}

/**
 * Users service
 */
export interface UsersService {
  /**
   * List users with pagination and filtering
   */
  list(params?: ListParams): Promise<PageResult<User>>;

  /**
   * Get a user by ID
   */
  get(id: string): Promise<User>;

  /**
   * Get a user by unique ID
   */
  getByUniqueId(uniqueId: string): Promise<User>;

  /**
   * Update a user
   */
  update(id: string, request: UpdateUserRequest): Promise<User>;

  /**
   * Update user profile
   */
  updateProfile(userId: string, request: UpdateProfileRequest): Promise<User>;

  /**
   * Delete a user
   */
  delete(id: string): Promise<void>;

  /**
   * Activate a user
   */
  activate(id: string): Promise<User>;

  /**
   * Deactivate a user
   */
  deactivate(id: string): Promise<User>;

  /**
   * Change user role
   * @param id - User unique ID
   * @param roleUniqueId - The unique ID of the new role
   * @param reason - Reason for role change (minimum 10 characters)
   * @param forceReauth - If true, invalidates user's existing tokens
   */
  changeRole(id: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User>;

  /**
   * Search users
   */
  search(query: string, params?: ListParams): Promise<PageResult<User>>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  if (params.include) {
    queryParams['include'] = params.include.join(',');
  }

  return queryParams;
}

/**
 * Create the users service
 */
export function createUsersService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): UsersService {
  return {
    async list(params?: ListParams): Promise<PageResult<User>> {
      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/users',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, userMapper);
    },

    async get(id: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        `/users/${id}`,
        { params: { include: 'role,user_avatar,user_profile' } }
      );
      return decodeOne(response, userMapper);
    },

    async getByUniqueId(uniqueId: string): Promise<User> {
      const response = await transport.get<{ data: unknown }>(
        `/users/by_unique_id/${uniqueId}`,
        { params: { include: 'role,user_avatar,user_profile' } }
      );
      return decodeOne(response, userMapper);
    },

    async update(id: string, request: UpdateUserRequest): Promise<User> {
      const response = await transport.patch<{ data: unknown }>(
        `/users/${id}`,
        {
          user: {
            name: request.name,
            username: request.username,
            nickname: request.nickname,
            bio: request.bio,
            role_id: request.roleId,
            status: request.status,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async updateProfile(userId: string, request: UpdateProfileRequest): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${userId}/profile`,
        {
          profile: {
            first_name: request.firstName,
            middle_name: request.middleName,
            last_name: request.lastName,
            gender: request.gender,
            zipcode: request.zipcode,
            phone_number: request.phoneNumber,
            preferred_language: request.preferredLanguage,
            time_zone: request.timeZone,
            web_site: request.webSite,
            twitter: request.twitter,
            fb: request.fb,
            instagram: request.instagram,
            linkedin: request.linkedin,
            youtube: request.youtube,
            blog: request.blog,
            payload: request.payload,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async delete(id: string): Promise<void> {
      await transport.delete(`/users/${id}`);
    },

    async activate(id: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${id}/activate`
      );
      return decodeOne(response, userMapper);
    },

    async deactivate(id: string): Promise<User> {
      const response = await transport.post<{ data: unknown }>(
        `/users/${id}/deactivate`
      );
      return decodeOne(response, userMapper);
    },

    async changeRole(id: string, roleUniqueId: string, reason: string, forceReauth?: boolean): Promise<User> {
      const response = await transport.put<{ data: unknown }>(
        `/users/${id}/role`,
        {
          role: {
            role_unique_id: roleUniqueId,
            reason: reason,
            force_reauth: forceReauth,
          },
        }
      );
      return decodeOne(response, userMapper);
    },

    async search(query: string, params?: ListParams): Promise<PageResult<User>> {
      const queryParams = buildListParams(params);
      queryParams['q'] = query;

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/users/search',
        { params: queryParams }
      );
      return decodePageResult(response, userMapper);
    },
  };
}
