import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetsUser,
  RegisterAssetsUserRequest,
  UpdateAssetsUserRequest,
  ListAssetsUsersParams,
  UserOwnership,
} from '../types/user';
import type { Asset } from '../types/asset';
import type { AssetsEntity } from '../types/entity';
import { assetsUserMapper } from '../mappers/user.mapper';
import { assetMapper } from '../mappers/asset.mapper';
import { assetsEntityMapper } from '../mappers/entity.mapper';

export interface AssetsUsersService {
  list(params?: ListAssetsUsersParams): Promise<PageResult<AssetsUser>>;
  get(uniqueId: string): Promise<AssetsUser>;
  register(uniqueId: string, data: RegisterAssetsUserRequest): Promise<AssetsUser>;
  update(uniqueId: string, data: UpdateAssetsUserRequest): Promise<AssetsUser>;
  listEntities(uniqueId: string): Promise<AssetsEntity[]>;
  listAssets(uniqueId: string): Promise<Asset[]>;
  listOwnership(uniqueId: string): Promise<UserOwnership[]>;
}

export function createAssetsUsersService(transport: Transport, _config: { appId: string }): AssetsUsersService {
  return {
    async list(params?: ListAssetsUsersParams): Promise<PageResult<AssetsUser>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;

      const response = await transport.get<unknown>('/users', { params: queryParams });
      return decodePageResult(response, assetsUserMapper);
    },

    async get(uniqueId: string): Promise<AssetsUser> {
      const response = await transport.get<unknown>(`/users/${uniqueId}`);
      return decodeOne(response, assetsUserMapper);
    },

    async register(uniqueId: string, data: RegisterAssetsUserRequest): Promise<AssetsUser> {
      const response = await transport.post<unknown>(`/users/${uniqueId}/register`, {
        user: {
          email: data.email,
          name: data.name,
          phone: data.phone,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetsUserMapper);
    },

    async update(uniqueId: string, data: UpdateAssetsUserRequest): Promise<AssetsUser> {
      const response = await transport.put<unknown>(`/users/${uniqueId}`, {
        user: {
          name: data.name,
          phone: data.phone,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetsUserMapper);
    },

    async listEntities(uniqueId: string): Promise<AssetsEntity[]> {
      const response = await transport.get<any>(`/users/${uniqueId}/entities`);
      // Could be JSON:API or plain array
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((e: any) => assetsEntityMapper.map({ id: e.id, type: 'entity', attributes: e }));
      }
      return (response.entities || response || []).map((e: any) => ({
        id: e.id,
        uniqueId: e.unique_id,
        name: e.name,
        description: e.description,
        entityType: e.entity_type,
        status: e.status,
        enabled: e.enabled ?? true,
        payload: e.payload,
        createdAt: new Date(e.created_at),
        updatedAt: new Date(e.updated_at),
      }));
    },

    async listAssets(uniqueId: string): Promise<Asset[]> {
      const response = await transport.get<any>(`/users/${uniqueId}/assets`);
      if (response.data && Array.isArray(response.data)) {
        return response.data.map((a: any) => assetMapper.map({ id: a.id, type: 'asset', attributes: a }));
      }
      return (response.assets || response || []).map((a: any) => ({
        id: a.id,
        uniqueId: a.unique_id,
        code: a.code,
        name: a.name,
        description: a.description,
        assetType: a.asset_type,
        serialNumber: a.serial_number,
        model: a.model,
        manufacturer: a.manufacturer,
        purchaseDate: a.purchase_date ? new Date(a.purchase_date) : undefined,
        purchasePrice: a.purchase_price,
        currentValue: a.current_value,
        locationUniqueId: a.location_unique_id,
        assignedToUniqueId: a.assigned_to_unique_id,
        status: a.status,
        enabled: a.enabled ?? true,
        payload: a.payload,
        tags: a.tags,
        createdAt: new Date(a.created_at),
        updatedAt: new Date(a.updated_at),
      }));
    },

    async listOwnership(uniqueId: string): Promise<UserOwnership[]> {
      const response = await transport.get<any>(`/users/${uniqueId}/ownership`);
      return (response.ownerships || response || []).map((o: any) => ({
        uniqueId: o.unique_id,
        assetUniqueId: o.asset_unique_id,
        userUniqueId: o.user_unique_id,
        ownershipType: o.ownership_type,
        acquiredAt: new Date(o.acquired_at),
        transferredAt: o.transferred_at ? new Date(o.transferred_at) : undefined,
        payload: o.payload,
      }));
    },
  };
}
