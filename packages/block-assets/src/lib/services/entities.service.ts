import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetsEntity,
  CreateAssetsEntityRequest,
  UpdateAssetsEntityRequest,
  ListAssetsEntitiesParams,
  EntityAccess,
  AccessRequest,
  CreateAccessRequestRequest,
} from '../types/entity.js';
import { assetsEntityMapper } from '../mappers/entity.mapper.js';

export interface AssetsEntitiesService {
  /**
   * List asset entities with optional filtering and sorting.
   * @returns Paginated list of AssetsEntity records with metadata.
   */
  list(params?: ListAssetsEntitiesParams): Promise<PageResult<AssetsEntity>>;

  /**
   * Get a single asset entity by unique ID.
   * @returns The matching AssetsEntity record.
   */
  get(uniqueId: string): Promise<AssetsEntity>;

  /**
   * Create a new asset entity.
   * @returns The newly created AssetsEntity record.
   */
  create(data: CreateAssetsEntityRequest): Promise<AssetsEntity>;

  /**
   * Update an existing asset entity.
   * @returns The updated AssetsEntity record.
   */
  update(uniqueId: string, data: UpdateAssetsEntityRequest): Promise<AssetsEntity>;

  /**
   * Delete an asset entity.
   */
  delete(uniqueId: string): Promise<void>;

  // Access Management

  /**
   * List access grants for an entity.
   * @returns Array of EntityAccess records.
   */
  listAccesses(uniqueId: string): Promise<EntityAccess[]>;

  /**
   * Get the access record for an entity.
   * @returns The EntityAccess record.
   */
  getAccess(uniqueId: string): Promise<EntityAccess>;

  /**
   * Make an entity publicly accessible.
   */
  makePublic(uniqueId: string): Promise<void>;

  /**
   * Revoke a specific access grant for an entity.
   */
  revokeAccess(uniqueId: string, accessUniqueId: string): Promise<void>;

  // Access Requests

  /**
   * Request access to an entity.
   * @returns The newly created AccessRequest record.
   */
  requestAccess(uniqueId: string, data: CreateAccessRequestRequest): Promise<AccessRequest>;

  /**
   * List pending access requests for an entity.
   * @returns Array of AccessRequest records.
   */
  listAccessRequests(uniqueId: string): Promise<AccessRequest[]>;

  /**
   * Approve an access request for an entity.
   * @returns The approved AccessRequest record.
   */
  approveAccessRequest(uniqueId: string, requestUniqueId: string): Promise<AccessRequest>;

  /**
   * Deny an access request for an entity.
   */
  denyAccessRequest(uniqueId: string, requestUniqueId: string): Promise<void>;
}

export function createAssetsEntitiesService(transport: Transport, _config: { apiKey: string }): AssetsEntitiesService {
  return {
    async list(params?: ListAssetsEntitiesParams): Promise<PageResult<AssetsEntity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.entityType) queryParams['entity_type'] = params.entityType;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/entities', { params: queryParams });
      return decodePageResult(response, assetsEntityMapper);
    },

    async get(uniqueId: string): Promise<AssetsEntity> {
      const response = await transport.get<unknown>(`/entities/${uniqueId}`);
      return decodeOne(response, assetsEntityMapper);
    },

    async create(data: CreateAssetsEntityRequest): Promise<AssetsEntity> {
      const response = await transport.post<unknown>('/entities', {
        entity: {
          name: data.name,
          description: data.description,
          entity_type: data.entityType,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetsEntityMapper);
    },

    async update(uniqueId: string, data: UpdateAssetsEntityRequest): Promise<AssetsEntity> {
      const response = await transport.put<unknown>(`/entities/${uniqueId}`, {
        entity: {
          name: data.name,
          description: data.description,
          entity_type: data.entityType,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetsEntityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}`);
    },

    async listAccesses(uniqueId: string): Promise<EntityAccess[]> {
      const response = await transport.get<any>(`/entities/${uniqueId}/accesses`);
      const items = Array.isArray(response?.data) ? response.data : [];
      return items.map((d: any) => {
        const a = d?.attributes ?? d ?? {};
        return {
          uniqueId: a.unique_id,
          entityUniqueId: a.entity_unique_id,
          userUniqueId: a.user_unique_id,
          accessLevel: a.access_level,
          grantedAt: new Date(a.granted_at),
          expiresAt: a.expires_at ? new Date(a.expires_at) : undefined,
          payload: a.payload,
        };
      });
    },

    async getAccess(uniqueId: string): Promise<EntityAccess> {
      const response = await transport.get<any>(`/entities/${uniqueId}/access`);
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        uniqueId: a.unique_id,
        entityUniqueId: a.entity_unique_id,
        userUniqueId: a.user_unique_id,
        accessLevel: a.access_level,
        grantedAt: new Date(a.granted_at),
        expiresAt: a.expires_at ? new Date(a.expires_at) : undefined,
        payload: a.payload,
      };
    },

    async makePublic(uniqueId: string): Promise<void> {
      await transport.post(`/entities/${uniqueId}/access/make_public`, {});
    },

    async revokeAccess(uniqueId: string, accessUniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}/access/${accessUniqueId}/revoke`);
    },

    async requestAccess(uniqueId: string, data: CreateAccessRequestRequest): Promise<AccessRequest> {
      const response = await transport.post<any>(`/entities/${uniqueId}/requests/access`, {
        access_request: {
          access_level: data.accessLevel,
          reason: data.reason,
          payload: data.payload,
        },
      });
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        uniqueId: a.unique_id,
        entityUniqueId: a.entity_unique_id,
        userUniqueId: a.user_unique_id,
        requestedAccessLevel: a.requested_access_level,
        status: a.status,
        reason: a.reason,
        requestedAt: new Date(a.requested_at),
        resolvedAt: a.resolved_at ? new Date(a.resolved_at) : undefined,
        payload: a.payload,
      };
    },

    async listAccessRequests(uniqueId: string): Promise<AccessRequest[]> {
      const response = await transport.get<any>(`/entities/${uniqueId}/access/requests`);
      const items = Array.isArray(response?.data) ? response.data : [];
      return items.map((d: any) => {
        const a = d?.attributes ?? d ?? {};
        return {
          uniqueId: a.unique_id,
          entityUniqueId: a.entity_unique_id,
          userUniqueId: a.user_unique_id,
          requestedAccessLevel: a.requested_access_level,
          status: a.status,
          reason: a.reason,
          requestedAt: new Date(a.requested_at),
          resolvedAt: a.resolved_at ? new Date(a.resolved_at) : undefined,
          payload: a.payload,
        };
      });
    },

    async approveAccessRequest(uniqueId: string, requestUniqueId: string): Promise<AccessRequest> {
      const response = await transport.put<any>(`/entities/${uniqueId}/access/requests/${requestUniqueId}/approve`, {});
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        uniqueId: a.unique_id,
        entityUniqueId: a.entity_unique_id,
        userUniqueId: a.user_unique_id,
        requestedAccessLevel: a.requested_access_level,
        status: a.status,
        reason: a.reason,
        requestedAt: new Date(a.requested_at),
        resolvedAt: a.resolved_at ? new Date(a.resolved_at) : undefined,
        payload: a.payload,
      };
    },

    async denyAccessRequest(uniqueId: string, requestUniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}/access/requests/${requestUniqueId}/deny`);
    },
  };
}
