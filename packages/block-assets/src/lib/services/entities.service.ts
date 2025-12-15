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
} from '../types/entity';
import { assetsEntityMapper } from '../mappers/entity.mapper';

export interface AssetsEntitiesService {
  list(params?: ListAssetsEntitiesParams): Promise<PageResult<AssetsEntity>>;
  get(uniqueId: string): Promise<AssetsEntity>;
  create(data: CreateAssetsEntityRequest): Promise<AssetsEntity>;
  update(uniqueId: string, data: UpdateAssetsEntityRequest): Promise<AssetsEntity>;
  delete(uniqueId: string): Promise<void>;
  // Access Management
  listAccesses(uniqueId: string): Promise<EntityAccess[]>;
  getAccess(uniqueId: string): Promise<EntityAccess>;
  makePublic(uniqueId: string): Promise<void>;
  revokeAccess(uniqueId: string, accessUniqueId: string): Promise<void>;
  // Access Requests
  requestAccess(uniqueId: string, data: CreateAccessRequestRequest): Promise<AccessRequest>;
  listAccessRequests(uniqueId: string): Promise<AccessRequest[]>;
  approveAccessRequest(uniqueId: string, requestUniqueId: string): Promise<AccessRequest>;
  denyAccessRequest(uniqueId: string, requestUniqueId: string): Promise<void>;
}

export function createAssetsEntitiesService(transport: Transport, _config: { appId: string }): AssetsEntitiesService {
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
      return (response.accesses || response || []).map((a: any) => ({
        uniqueId: a.unique_id,
        entityUniqueId: a.entity_unique_id,
        userUniqueId: a.user_unique_id,
        accessLevel: a.access_level,
        grantedAt: new Date(a.granted_at),
        expiresAt: a.expires_at ? new Date(a.expires_at) : undefined,
        payload: a.payload,
      }));
    },

    async getAccess(uniqueId: string): Promise<EntityAccess> {
      const response = await transport.get<any>(`/entities/${uniqueId}/access`);
      return {
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        userUniqueId: response.user_unique_id,
        accessLevel: response.access_level,
        grantedAt: new Date(response.granted_at),
        expiresAt: response.expires_at ? new Date(response.expires_at) : undefined,
        payload: response.payload,
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
      return {
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        userUniqueId: response.user_unique_id,
        requestedAccessLevel: response.requested_access_level,
        status: response.status,
        reason: response.reason,
        requestedAt: new Date(response.requested_at),
        resolvedAt: response.resolved_at ? new Date(response.resolved_at) : undefined,
        payload: response.payload,
      };
    },

    async listAccessRequests(uniqueId: string): Promise<AccessRequest[]> {
      const response = await transport.get<any>(`/entities/${uniqueId}/access/requests`);
      return (response.access_requests || response || []).map((r: any) => ({
        uniqueId: r.unique_id,
        entityUniqueId: r.entity_unique_id,
        userUniqueId: r.user_unique_id,
        requestedAccessLevel: r.requested_access_level,
        status: r.status,
        reason: r.reason,
        requestedAt: new Date(r.requested_at),
        resolvedAt: r.resolved_at ? new Date(r.resolved_at) : undefined,
        payload: r.payload,
      }));
    },

    async approveAccessRequest(uniqueId: string, requestUniqueId: string): Promise<AccessRequest> {
      const response = await transport.put<any>(`/entities/${uniqueId}/access/requests/${requestUniqueId}/approve`, {});
      return {
        uniqueId: response.unique_id,
        entityUniqueId: response.entity_unique_id,
        userUniqueId: response.user_unique_id,
        requestedAccessLevel: response.requested_access_level,
        status: response.status,
        reason: response.reason,
        requestedAt: new Date(response.requested_at),
        resolvedAt: response.resolved_at ? new Date(response.resolved_at) : undefined,
        payload: response.payload,
      };
    },

    async denyAccessRequest(uniqueId: string, requestUniqueId: string): Promise<void> {
      await transport.delete(`/entities/${uniqueId}/access/requests/${requestUniqueId}/deny`);
    },
  };
}
