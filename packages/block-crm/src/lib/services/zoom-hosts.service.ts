import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  ZoomHost,
  ZoomHostAvailability,
  ZoomHostAllocation,
  AvailableUser,
  CreateZoomHostRequest,
  UpdateZoomHostRequest,
  ListZoomHostsParams,
} from '../types/zoom-host.js';
import { zoomHostMapper } from '../mappers/zoom-host.mapper.js';

export interface ZoomHostsService {
  /**
   * List Zoom hosts with optional filtering, pagination, and sorting.
   * @param params - Optional filtering (status, licenseType, available, search), pagination, and sorting.
   * @returns Paginated result containing ZoomHost objects and metadata.
   */
  list(params?: ListZoomHostsParams): Promise<PageResult<ZoomHost>>;

  /**
   * Retrieve a single Zoom host by its unique identifier.
   * @param uniqueId - The unique identifier of the Zoom host.
   * @returns The matching ZoomHost object.
   */
  get(uniqueId: string): Promise<ZoomHost>;

  /**
   * Create a new Zoom host.
   * @param data - The Zoom host creation payload with user reference, Zoom user ID, email, name, license, and capacity.
   * @returns The newly created ZoomHost object.
   */
  create(data: CreateZoomHostRequest): Promise<ZoomHost>;

  /**
   * Update an existing Zoom host.
   * @param uniqueId - The unique identifier of the Zoom host to update.
   * @param data - The fields to update on the Zoom host.
   * @returns The updated ZoomHost object.
   * @note Uses PUT (not PATCH) as required by the 23blocks backend.
   */
  update(uniqueId: string, data: UpdateZoomHostRequest): Promise<ZoomHost>;

  /**
   * Delete a Zoom host.
   * @param uniqueId - The unique identifier of the Zoom host to delete.
   * @returns Resolves when the Zoom host has been deleted.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Retrieve the availability status of a Zoom host.
   * @param uniqueId - The unique identifier of the Zoom host.
   * @returns A ZoomHostAvailability object with the host's current availability details.
   */
  getAvailability(uniqueId: string): Promise<ZoomHostAvailability>;

  /**
   * Retrieve the meeting allocations for a Zoom host.
   * @param uniqueId - The unique identifier of the Zoom host.
   * @returns An array of ZoomHostAllocation objects representing assigned meetings.
   */
  getAllocations(uniqueId: string): Promise<ZoomHostAllocation[]>;

  /**
   * Retrieve users who are available to become Zoom hosts.
   * @returns An array of AvailableUser objects representing eligible users.
   */
  getAvailableUsers(): Promise<AvailableUser[]>;
}

export function createZoomHostsService(transport: Transport, _config: { appId: string }): ZoomHostsService {
  return {
    async list(params?: ListZoomHostsParams): Promise<PageResult<ZoomHost>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.licenseType) queryParams['license_type'] = params.licenseType;
      if (params?.available !== undefined) queryParams['available'] = String(params.available);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/zoom_hosts', { params: queryParams });
      return decodePageResult(response, zoomHostMapper);
    },

    async get(uniqueId: string): Promise<ZoomHost> {
      const response = await transport.get<unknown>(`/zoom_hosts/${uniqueId}`);
      return decodeOne(response, zoomHostMapper);
    },

    async create(data: CreateZoomHostRequest): Promise<ZoomHost> {
      const response = await transport.post<unknown>('/zoom_hosts', {
        zoom_host: {
          user_unique_id: data.userUniqueId,
          zoom_user_id: data.zoomUserId,
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          host_key: data.hostKey,
          license_type: data.licenseType,
          max_meetings: data.maxMeetings,
          payload: data.payload,
        },
      });
      return decodeOne(response, zoomHostMapper);
    },

    async update(uniqueId: string, data: UpdateZoomHostRequest): Promise<ZoomHost> {
      const response = await transport.put<unknown>(`/zoom_hosts/${uniqueId}`, {
        zoom_host: {
          first_name: data.firstName,
          last_name: data.lastName,
          display_name: data.displayName,
          host_key: data.hostKey,
          license_type: data.licenseType,
          max_meetings: data.maxMeetings,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, zoomHostMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/zoom_hosts/${uniqueId}`);
    },

    async getAvailability(uniqueId: string): Promise<ZoomHostAvailability> {
      const response = await transport.get<{ data: ZoomHostAvailability }>(`/zoom_hosts/${uniqueId}/availability`);
      return response.data;
    },

    async getAllocations(uniqueId: string): Promise<ZoomHostAllocation[]> {
      const response = await transport.get<{ data: ZoomHostAllocation[] }>(`/zoom_hosts/${uniqueId}/allocations`);
      return response.data || [];
    },

    async getAvailableUsers(): Promise<AvailableUser[]> {
      const response = await transport.get<{ data: AvailableUser[] }>('/zoom_hosts/available_users');
      return response.data || [];
    },
  };
}
