import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Permission } from '../types/index.js';
import { permissionMapper } from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Create permission request
 */
export interface CreatePermissionRequest {
  name: string;
  level?: number;
  parentId?: string;
  description?: string;
  category?: string;
  riskLevel?: string;
}

/**
 * Update permission request
 */
export interface UpdatePermissionRequest {
  name?: string;
  level?: number;
  parentId?: string;
  description?: string;
  status?: string;
  category?: string;
  riskLevel?: string;
}

/**
 * Permissions service for managing standalone permissions
 */
export interface PermissionsService {
  /**
   * List all permissions
   */
  list(params?: ListParams): Promise<PageResult<Permission>>;

  /**
   * Get a permission by unique ID
   */
  get(uniqueId: string): Promise<Permission>;

  /**
   * Create a new permission
   */
  create(request: CreatePermissionRequest): Promise<Permission>;

  /**
   * Update a permission
   */
  update(uniqueId: string, request: UpdatePermissionRequest): Promise<Permission>;

  /**
   * Delete a permission
   */
  delete(uniqueId: string): Promise<void>;
}

/**
 * Create the permissions service
 */
export function createPermissionsService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): PermissionsService {
  return {
    async list(params?: ListParams): Promise<PageResult<Permission>> {
      const queryParams: Record<string, unknown> = {};

      if (params?.page) queryParams['page'] = params.page;
      if (params?.perPage) queryParams['records'] = params.perPage;
      if (params?.include) queryParams['include'] = params.include.join(',');

      const response = await transport.get<{ data: unknown[]; meta?: unknown }>(
        '/permissions',
        { params: queryParams as Record<string, string> }
      );
      return decodePageResult(response, permissionMapper);
    },

    async get(uniqueId: string): Promise<Permission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<{ data: unknown }>(
        `/permissions/${uniqueId}`
      );
      return decodeOne(response, permissionMapper);
    },

    async create(request: CreatePermissionRequest): Promise<Permission> {
      const response = await transport.post<{ data: unknown }>(
        '/permissions',
        {
          permission: {
            name: request.name,
            level: request.level,
            parent_id: request.parentId,
            description: request.description,
            category: request.category,
            risk_level: request.riskLevel,
          },
        }
      );
      return decodeOne(response, permissionMapper);
    },

    async update(uniqueId: string, request: UpdatePermissionRequest): Promise<Permission> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<{ data: unknown }>(
        `/permissions/${uniqueId}`,
        {
          permission: {
            name: request.name,
            level: request.level,
            parent_id: request.parentId,
            description: request.description,
            status: request.status,
            category: request.category,
            risk_level: request.riskLevel,
          },
        }
      );
      return decodeOne(response, permissionMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/permissions/${uniqueId}`);
    },
  };
}
