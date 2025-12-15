import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
  ListAssetsParams,
  TransferAssetRequest,
  AssignAssetRequest,
} from '../types/asset';
import { assetMapper } from '../mappers/asset.mapper';

export interface AssetsService {
  list(params?: ListAssetsParams): Promise<PageResult<Asset>>;
  get(uniqueId: string): Promise<Asset>;
  create(data: CreateAssetRequest): Promise<Asset>;
  update(uniqueId: string, data: UpdateAssetRequest): Promise<Asset>;
  delete(uniqueId: string): Promise<void>;
  transfer(uniqueId: string, data: TransferAssetRequest): Promise<Asset>;
  assign(uniqueId: string, data: AssignAssetRequest): Promise<Asset>;
  unassign(uniqueId: string): Promise<Asset>;
  listByLocation(locationUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>>;
  listByAssignee(assignedToUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>>;
}

export function createAssetsService(transport: Transport, _config: { appId: string }): AssetsService {
  return {
    async list(params?: ListAssetsParams): Promise<PageResult<Asset>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.assetType) queryParams['asset_type'] = params.assetType;
      if (params?.locationUniqueId) queryParams['location_unique_id'] = params.locationUniqueId;
      if (params?.assignedToUniqueId) queryParams['assigned_to_unique_id'] = params.assignedToUniqueId;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/assets', { params: queryParams });
      return decodePageResult(response, assetMapper);
    },

    async get(uniqueId: string): Promise<Asset> {
      const response = await transport.get<unknown>(`/assets/${uniqueId}`);
      return decodeOne(response, assetMapper);
    },

    async create(data: CreateAssetRequest): Promise<Asset> {
      const response = await transport.post<unknown>('/assets', {
        asset: {
            code: data.code,
            name: data.name,
            description: data.description,
            asset_type: data.assetType,
            serial_number: data.serialNumber,
            model: data.model,
            manufacturer: data.manufacturer,
            purchase_date: data.purchaseDate?.toISOString(),
            purchase_price: data.purchasePrice,
            current_value: data.currentValue,
            location_unique_id: data.locationUniqueId,
            assigned_to_unique_id: data.assignedToUniqueId,
            payload: data.payload,
            tags: data.tags,
          },
      });
      return decodeOne(response, assetMapper);
    },

    async update(uniqueId: string, data: UpdateAssetRequest): Promise<Asset> {
      const response = await transport.put<unknown>(`/assets/${uniqueId}`, {
        asset: {
            name: data.name,
            description: data.description,
            asset_type: data.assetType,
            serial_number: data.serialNumber,
            model: data.model,
            manufacturer: data.manufacturer,
            purchase_date: data.purchaseDate?.toISOString(),
            purchase_price: data.purchasePrice,
            current_value: data.currentValue,
            location_unique_id: data.locationUniqueId,
            assigned_to_unique_id: data.assignedToUniqueId,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
            tags: data.tags,
          },
      });
      return decodeOne(response, assetMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/assets/${uniqueId}`);
    },

    async transfer(uniqueId: string, data: TransferAssetRequest): Promise<Asset> {
      const response = await transport.post<unknown>(`/assets/${uniqueId}/transfer`, {
        asset: {
            location_unique_id: data.locationUniqueId,
            notes: data.notes,
          },
      });
      return decodeOne(response, assetMapper);
    },

    async assign(uniqueId: string, data: AssignAssetRequest): Promise<Asset> {
      const response = await transport.post<unknown>(`/assets/${uniqueId}/assign`, {
        asset: {
            assigned_to_unique_id: data.assignedToUniqueId,
            notes: data.notes,
          },
      });
      return decodeOne(response, assetMapper);
    },

    async unassign(uniqueId: string): Promise<Asset> {
      const response = await transport.post<unknown>(`/assets/${uniqueId}/unassign`, {});
      return decodeOne(response, assetMapper);
    },

    async listByLocation(locationUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>> {
      const queryParams: Record<string, string> = {
        location_unique_id: locationUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/assets', { params: queryParams });
      return decodePageResult(response, assetMapper);
    },

    async listByAssignee(assignedToUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>> {
      const queryParams: Record<string, string> = {
        assigned_to_unique_id: assignedToUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/assets', { params: queryParams });
      return decodePageResult(response, assetMapper);
    },
  };
}
