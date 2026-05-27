import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Asset,
  CreateAssetRequest,
  UpdateAssetRequest,
  ListAssetsParams,
  TransferAssetRequest,
  AssignAssetRequest,
} from '../types/asset.js';
import type {
  AddToCategoryRequest,
  AddPartsRequest,
  RemovePartsRequest,
  UpdateMaintenanceRequest,
  LendAssetRequest,
  CreateOTPRequest,
  OTPResponse,
} from '../types/asset-image.js';
import { assetMapper } from '../mappers/asset.mapper.js';

export interface AssetsService {
  /**
   * List assets with optional filtering and sorting.
   * @returns Paginated list of Asset records with metadata.
   */
  list(params?: ListAssetsParams): Promise<PageResult<Asset>>;

  /**
   * Get a single asset by unique ID.
   * @returns The matching Asset record.
   */
  get(uniqueId: string): Promise<Asset>;

  /**
   * Create a new asset.
   * @returns The newly created Asset record.
   */
  create(data: CreateAssetRequest): Promise<Asset>;

  /**
   * Update an existing asset.
   * @returns The updated Asset record.
   */
  update(uniqueId: string, data: UpdateAssetRequest): Promise<Asset>;

  /**
   * Delete an asset (moves to trash).
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List trashed (soft-deleted) assets.
   * @returns Paginated list of trashed Asset records.
   */
  listTrash(): Promise<PageResult<Asset>>;

  /**
   * Transfer an asset to a new location.
   * @returns The Asset record with the updated location.
   */
  transfer(uniqueId: string, data: TransferAssetRequest): Promise<Asset>;

  /**
   * Assign an asset to a user.
   * @returns The Asset record with the assignment.
   */
  assign(uniqueId: string, data: AssignAssetRequest): Promise<Asset>;

  /**
   * Unassign an asset from its current assignee.
   * @returns The Asset record with the assignment removed.
   */
  unassign(uniqueId: string): Promise<Asset>;

  /**
   * List assets at a specific location.
   * @returns Paginated list of Asset records at the location.
   */
  listByLocation(locationUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>>;

  /**
   * List assets assigned to a specific user.
   * @returns Paginated list of Asset records for the assignee.
   */
  listByAssignee(assignedToUniqueId: string, params?: ListAssetsParams): Promise<PageResult<Asset>>;

  /**
   * Add an asset to a category.
   * @returns The updated Asset record.
   */
  addToCategory(uniqueId: string, data: AddToCategoryRequest): Promise<Asset>;

  /**
   * Add parts (sub-assets) to an asset.
   * @returns The updated Asset record.
   */
  addParts(uniqueId: string, data: AddPartsRequest): Promise<Asset>;

  /**
   * Remove parts (sub-assets) from an asset.
   * @returns The updated Asset record.
   */
  removeParts(uniqueId: string, data: RemovePartsRequest): Promise<Asset>;

  /**
   * Update maintenance information for an asset.
   * @returns The updated Asset record.
   */
  updateMaintenance(uniqueId: string, data: UpdateMaintenanceRequest): Promise<Asset>;

  /**
   * Lend an asset to a user.
   * @returns The Asset record with lending information.
   */
  lend(uniqueId: string, data: LendAssetRequest): Promise<Asset>;

  /**
   * Create a one-time password for asset verification.
   * @returns OTPResponse with `code` and `expiresAt`.
   */
  createOTP(uniqueId: string, data?: CreateOTPRequest): Promise<OTPResponse>;
}

export function createAssetsService(transport: Transport, _config: { apiKey: string }): AssetsService {
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

    async listTrash(): Promise<PageResult<Asset>> {
      const response = await transport.get<unknown>('/assets/trash/show');
      return decodePageResult(response, assetMapper);
    },

    async addToCategory(uniqueId: string, data: AddToCategoryRequest): Promise<Asset> {
      const response = await transport.post<unknown>(`/assets/${uniqueId}/categories`, {
        category_unique_id: data.categoryUniqueId,
      });
      return decodeOne(response, assetMapper);
    },

    async addParts(uniqueId: string, data: AddPartsRequest): Promise<Asset> {
      const response = await transport.put<unknown>(`/assets/${uniqueId}/parts`, {
        part_unique_ids: data.partUniqueIds,
      });
      return decodeOne(response, assetMapper);
    },

    async removeParts(uniqueId: string, data: RemovePartsRequest): Promise<Asset> {
      const response = await transport.delete<unknown>(`/assets/${uniqueId}/parts`, {
        params: { part_unique_ids: data.partUniqueIds.join(',') },
      });
      return decodeOne(response, assetMapper);
    },

    async updateMaintenance(uniqueId: string, data: UpdateMaintenanceRequest): Promise<Asset> {
      const response = await transport.put<unknown>(`/assets/${uniqueId}/maintenance`, {
        maintenance: {
          maintenance_date: data.maintenanceDate?.toISOString(),
          maintenance_interval: data.maintenanceInterval,
          maintenance_notes: data.maintenanceNotes,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetMapper);
    },

    async lend(uniqueId: string, data: LendAssetRequest): Promise<Asset> {
      const response = await transport.post<unknown>(`/assets/${uniqueId}/lend`, {
        lend: {
          user_unique_id: data.userUniqueId,
          due_date: data.dueDate?.toISOString(),
          notes: data.notes,
          payload: data.payload,
        },
      });
      return decodeOne(response, assetMapper);
    },

    async createOTP(uniqueId: string, data?: CreateOTPRequest): Promise<OTPResponse> {
      const response = await transport.post<any>(`/assets/${uniqueId}/otp`, {
        otp: {
          expires_in: data?.expiresIn,
          payload: data?.payload,
        },
      });
      const d = response?.data ?? response ?? {};
      const a = d?.attributes ?? d ?? {};
      return {
        code: a.code,
        expiresAt: new Date(a.expires_at),
      };
    },
  };
}
