import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  AssetsUser,
  RegisterAssetsUserRequest,
  UpdateAssetsUserRequest,
  ListAssetsUsersParams,
  UserOwnership,
} from '../types/user.js';
import type { Asset } from '../types/asset.js';
import type { AssetsEntity } from '../types/entity.js';
import { assetsUserMapper } from '../mappers/user.mapper.js';
import { assetMapper } from '../mappers/asset.mapper.js';
import { assetsEntityMapper } from '../mappers/entity.mapper.js';

export interface AssetsUsersService {
  /**
   * List asset users with optional filtering and sorting.
   * @returns Paginated list of AssetsUser records with metadata.
   */
  list(params?: ListAssetsUsersParams): Promise<PageResult<AssetsUser>>;

  /**
   * Get a single asset user by unique ID.
   * @returns The matching AssetsUser record.
   */
  get(uniqueId: string): Promise<AssetsUser>;

  /**
   * Register a user in the assets system.
   * @returns The newly registered AssetsUser record.
   */
  register(uniqueId: string, data: RegisterAssetsUserRequest): Promise<AssetsUser>;

  /**
   * Update an asset user.
   * @returns The updated AssetsUser record.
   */
  update(uniqueId: string, data: UpdateAssetsUserRequest): Promise<AssetsUser>;

  /**
   * List entities associated with a user.
   * @returns Array of AssetsEntity records.
   */
  listEntities(uniqueId: string): Promise<AssetsEntity[]>;

  /**
   * List assets assigned to a user.
   * @returns Array of Asset records.
   */
  listAssets(uniqueId: string): Promise<Asset[]>;

  /**
   * List ownership records for a user.
   * @returns Array of UserOwnership records.
   */
  listOwnership(uniqueId: string): Promise<UserOwnership[]>;
}

export function createAssetsUsersService(transport: Transport, _config: { apiKey: string }): AssetsUsersService {
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
      const items = Array.isArray(response?.data) ? response.data : [];
      return items.map((e: any) =>
        assetsEntityMapper.map({ id: e.id, type: e.type ?? 'entity', attributes: e.attributes ?? {} }, new Map())
      );
    },

    async listAssets(uniqueId: string): Promise<Asset[]> {
      const response = await transport.get<any>(`/users/${uniqueId}/assets`);
      const items = Array.isArray(response?.data) ? response.data : [];
      return items.map((a: any) =>
        assetMapper.map({ id: a.id, type: a.type ?? 'asset', attributes: a.attributes ?? {} }, new Map())
      );
    },

    async listOwnership(uniqueId: string): Promise<UserOwnership[]> {
      const response = await transport.get<any>(`/users/${uniqueId}/ownership`);
      const items = Array.isArray(response?.data) ? response.data : [];

      // Index `included[]` so we can pull each ownership row's full Asset
      // record in O(1). The backend includes assets explicitly because
      // ownership records are usually consumed alongside asset detail.
      const includedMap = new Map<string, any>();
      const included = Array.isArray(response?.included) ? response.included : [];
      for (const inc of included) {
        if (inc?.type === 'asset' || inc?.type === 'Asset') {
          includedMap.set(String(inc.id ?? ''), inc);
        }
      }

      return items.map((d: any) => {
        const o = d?.attributes ?? d ?? {};
        // The asset relationship lives in `d.relationships.asset.data.id`
        // (JSON:API standard); fall back to attribute lookup if missing.
        const relAssetId = d?.relationships?.asset?.data?.id;
        const includedAsset = relAssetId ? includedMap.get(String(relAssetId)) : undefined;
        return {
          uniqueId: o.unique_id,
          assetUniqueId: o.asset_unique_id,
          userUniqueId: o.user_unique_id,
          ownershipType: o.ownership_type,
          acquiredAt: new Date(o.acquired_at),
          transferredAt: o.transferred_at ? new Date(o.transferred_at) : undefined,
          payload: o.payload,
          asset: includedAsset
            ? assetMapper.map(
                { id: includedAsset.id, type: includedAsset.type ?? 'asset', attributes: includedAsset.attributes ?? {} },
                new Map(),
              )
            : undefined,
        };
      });
    },
  };
}
