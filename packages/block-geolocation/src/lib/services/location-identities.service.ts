import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LocationIdentity,
  CreateLocationIdentityRequest,
  UpdateLocationIdentityRequest,
  ListLocationIdentitiesParams,
} from '../types/location-identity';
import { locationIdentityMapper } from '../mappers/location-identity.mapper';

export interface LocationIdentitiesService {
  list(params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;
  get(uniqueId: string): Promise<LocationIdentity>;
  create(data: CreateLocationIdentityRequest): Promise<LocationIdentity>;
  update(uniqueId: string, data: UpdateLocationIdentityRequest): Promise<LocationIdentity>;
  delete(uniqueId: string): Promise<void>;
  checkIn(locationUniqueId: string, identityUniqueId: string, identityType: string): Promise<LocationIdentity>;
  checkOut(uniqueId: string): Promise<LocationIdentity>;
  listByLocation(locationUniqueId: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;
  listByIdentity(identityUniqueId: string, identityType: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;
  getCurrentLocation(identityUniqueId: string, identityType: string): Promise<LocationIdentity | null>;
}

export function createLocationIdentitiesService(transport: Transport, _config: { appId: string }): LocationIdentitiesService {
  return {
    async list(params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.locationUniqueId) queryParams['location_unique_id'] = params.locationUniqueId;
      if (params?.identityUniqueId) queryParams['identity_unique_id'] = params.identityUniqueId;
      if (params?.identityType) queryParams['identity_type'] = params.identityType;
      if (params?.role) queryParams['role'] = params.role;
      if (params?.isPresent !== undefined) queryParams['is_present'] = String(params.isPresent);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/location_identities', { params: queryParams });
      return decodePageResult(response, locationIdentityMapper);
    },

    async get(uniqueId: string): Promise<LocationIdentity> {
      const response = await transport.get<unknown>(`/location_identities/${uniqueId}`);
      return decodeOne(response, locationIdentityMapper);
    },

    async create(data: CreateLocationIdentityRequest): Promise<LocationIdentity> {
      const response = await transport.post<unknown>('/location_identities', {
        location_identity: {
          location_unique_id: data.locationUniqueId,
          identity_unique_id: data.identityUniqueId,
          identity_type: data.identityType,
          role: data.role,
          device_id: data.deviceId,
          device_type: data.deviceType,
          accuracy: data.accuracy,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationIdentityMapper);
    },

    async update(uniqueId: string, data: UpdateLocationIdentityRequest): Promise<LocationIdentity> {
      const response = await transport.put<unknown>(`/location_identities/${uniqueId}`, {
        location_identity: {
          role: data.role,
          device_id: data.deviceId,
          device_type: data.deviceType,
          accuracy: data.accuracy,
          enabled: data.enabled,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, locationIdentityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/location_identities/${uniqueId}`);
    },

    async checkIn(locationUniqueId: string, identityUniqueId: string, identityType: string): Promise<LocationIdentity> {
      const response = await transport.post<unknown>('/location_identities/check_in', {
        location_identity: {
          location_unique_id: locationUniqueId,
          identity_unique_id: identityUniqueId,
          identity_type: identityType,
        },
      });
      return decodeOne(response, locationIdentityMapper);
    },

    async checkOut(uniqueId: string): Promise<LocationIdentity> {
      const response = await transport.post<unknown>(`/location_identities/${uniqueId}/check_out`, {});
      return decodeOne(response, locationIdentityMapper);
    },

    async listByLocation(locationUniqueId: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>> {
      const queryParams: Record<string, string> = {
        location_unique_id: locationUniqueId,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.identityType) queryParams['identity_type'] = params.identityType;
      if (params?.role) queryParams['role'] = params.role;
      if (params?.isPresent !== undefined) queryParams['is_present'] = String(params.isPresent);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/location_identities', { params: queryParams });
      return decodePageResult(response, locationIdentityMapper);
    },

    async listByIdentity(identityUniqueId: string, identityType: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>> {
      const queryParams: Record<string, string> = {
        identity_unique_id: identityUniqueId,
        identity_type: identityType,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.locationUniqueId) queryParams['location_unique_id'] = params.locationUniqueId;
      if (params?.role) queryParams['role'] = params.role;
      if (params?.isPresent !== undefined) queryParams['is_present'] = String(params.isPresent);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/location_identities', { params: queryParams });
      return decodePageResult(response, locationIdentityMapper);
    },

    async getCurrentLocation(identityUniqueId: string, identityType: string): Promise<LocationIdentity | null> {
      try {
        const response = await transport.get<unknown>('/location_identities/current', {
          params: {
            identity_unique_id: identityUniqueId,
            identity_type: identityType,
          },
        });
        return decodeOne(response, locationIdentityMapper);
      } catch {
        return null;
      }
    },
  };
}
