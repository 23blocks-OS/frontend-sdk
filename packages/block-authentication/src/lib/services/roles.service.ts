import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Role, Permission } from '../types/index.js';
import { roleMapper, permissionMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Create role request
 */
export interface CreateRoleRequest {
  name: string;
  code: string;
  description?: string;
  payload?: Record<string, unknown>;
  onBoardingUniqueId?: string;
  onBoardingUrl?: string;
  onBoardingPayload?: Record<string, unknown>;
}

/**
 * Update role request
 */
export interface UpdateRoleRequest {
  name?: string;
  code?: string;
  description?: string;
  status?: string;
  payload?: Record<string, unknown>;
  onBoardingUniqueId?: string;
  onBoardingUrl?: string;
  onBoardingPayload?: Record<string, unknown>;
}

/**
 * Roles service
 */
export interface RolesService {
  /**
   * List all roles
   */
  list(params?: ListParams): Promise<PageResult<Role>>;

  /**
   * Get a role by ID
   */
  get(id: string): Promise<Role>;

  /**
   * Get a role by code
   */
  getByCode(code: string): Promise<Role>;

  /**
   * Create a new role
   */
  create(request: CreateRoleRequest): Promise<Role>;

  /**
   * Update a role
   */
  update(id: string, request: UpdateRoleRequest): Promise<Role>;

  /**
   * Delete a role
   */
  delete(id: string): Promise<void>;

  /**
   * Get permissions for a role
   */
  getPermissions(roleId: string): Promise<Permission[]>;

  /**
   * Set permissions for a role
   */
  setPermissions(roleId: string, permissionIds: string[]): Promise<Role>;

  /**
   * Add permission to a role
   */
  addPermission(roleId: string, permissionId: string): Promise<Role>;

  /**
   * Remove permission from a role
   */
  removePermission(roleId: string, permissionId: string): Promise<Role>;

  /**
   * List all permissions
   */
  listPermissions(params?: ListParams): Promise<PageResult<Permission>>;
}

/**
 * Create the roles service
 */
export function createRolesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): RolesService {
  return {
    async list(params?: ListParams): Promise<PageResult<Role>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page[number]'] = params.page;
      if (params?.perPage) queryParams['page[size]'] = params.perPage;
      if (params?.include) queryParams['include'] = params.include.join(',');

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/roles',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, roleMapper);
    },

    async get(id: string): Promise<Role> {
      const response = await transport.get<{ data: unknown }>(
        `/roles/${id}`,
        { params: { include: 'permissions' } }
      );
      return decodeOne(response, roleMapper);
    },

    async getByCode(code: string): Promise<Role> {
      const response = await transport.get<{ data: unknown }>(
        `/roles/by_code/${code}`,
        { params: { include: 'permissions' } }
      );
      return decodeOne(response, roleMapper);
    },

    async create(request: CreateRoleRequest): Promise<Role> {
      const response = await transport.post<{ data: unknown }>(
        '/roles',
        {
          role: {
            name: request.name,
            code: request.code,
            description: request.description,
            payload: request.payload,
            on_boarding_unique_id: request.onBoardingUniqueId,
            on_boarding_url: request.onBoardingUrl,
            on_boarding_payload: request.onBoardingPayload,
          },
        }
      );
      return decodeOne(response, roleMapper);
    },

    async update(id: string, request: UpdateRoleRequest): Promise<Role> {
      const response = await transport.put<{ data: unknown }>(
        `/roles/${id}`,
        {
          role: {
            name: request.name,
            code: request.code,
            description: request.description,
            status: request.status,
            payload: request.payload,
            on_boarding_unique_id: request.onBoardingUniqueId,
            on_boarding_url: request.onBoardingUrl,
            on_boarding_payload: request.onBoardingPayload,
          },
        }
      );
      return decodeOne(response, roleMapper);
    },

    async delete(id: string): Promise<void> {
      await transport.delete(`/roles/${id}`);
    },

    async getPermissions(roleId: string): Promise<Permission[]> {
      const response = await transport.get<{ data: unknown[] }>(
        `/roles/${roleId}/permissions`
      );
      return decodeMany(response, permissionMapper);
    },

    async setPermissions(roleId: string, permissionIds: string[]): Promise<Role> {
      const response = await transport.put<{ data: unknown }>(
        `/roles/${roleId}/permissions`,
        { permission_ids: permissionIds }
      );
      return decodeOne(response, roleMapper);
    },

    async addPermission(roleId: string, permissionId: string): Promise<Role> {
      const response = await transport.post<{ data: unknown }>(
        `/roles/${roleId}/permissions/${permissionId}`
      );
      return decodeOne(response, roleMapper);
    },

    async removePermission(roleId: string, permissionId: string): Promise<Role> {
      const response = await transport.delete<{ data: unknown }>(
        `/roles/${roleId}/permissions/${permissionId}`
      );
      return decodeOne(response, roleMapper);
    },

    async listPermissions(params?: ListParams): Promise<PageResult<Permission>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page[number]'] = params.page;
      if (params?.perPage) queryParams['page[size]'] = params.perPage;

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/permissions',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, permissionMapper);
    },
  };
}
