import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  LocationIdentity,
  CreateLocationIdentityRequest,
  UpdateLocationIdentityRequest,
  ListLocationIdentitiesParams,
} from '../types/location-identity.js';
import { locationIdentityMapper } from '../mappers/location-identity.mapper.js';

export interface LocationIdentitiesService {
  /**
   * List all location-identity associations
   * @param params - Optional filtering by location, identity, role, presence, status, and pagination
   * @returns Paginated result containing LocationIdentity items and metadata
   */
  list(params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;

  /**
   * Get a specific location-identity association
   * @param uniqueId - The unique identifier of the association
   * @returns The matching LocationIdentity record
   */
  get(uniqueId: string): Promise<LocationIdentity>;

  /**
   * Create a new location-identity association
   * @param data - Association details including location, identity, role, and device info
   * @returns The newly created LocationIdentity record
   */
  create(data: CreateLocationIdentityRequest): Promise<LocationIdentity>;

  /**
   * Update a location-identity association
   * @param uniqueId - The unique identifier of the association to update
   * @param data - Fields to update such as role, device info, or status
   * @returns The updated LocationIdentity record
   */
  update(uniqueId: string, data: UpdateLocationIdentityRequest): Promise<LocationIdentity>;

  /**
   * Delete a location-identity association
   * @param uniqueId - The unique identifier of the association to delete
   * @returns Resolves when the association has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Check in an identity at a location
   * @param locationUniqueId - The unique identifier of the location
   * @param identityUniqueId - The unique identifier of the identity
   * @param identityType - The type of identity (e.g., user, device)
   * @returns The LocationIdentity record with check-in recorded
   */
  checkIn(locationUniqueId: string, identityUniqueId: string, identityType: string): Promise<LocationIdentity>;

  /**
   * Check out an identity from its current location
   * @param uniqueId - The unique identifier of the location-identity association
   * @returns The LocationIdentity record with check-out recorded
   */
  checkOut(uniqueId: string): Promise<LocationIdentity>;

  /**
   * List all identities at a specific location
   * @param locationUniqueId - The unique identifier of the location
   * @param params - Optional filtering by identity type, role, presence, and pagination
   * @returns Paginated result of LocationIdentity records at the given location
   */
  listByLocation(locationUniqueId: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;

  /**
   * List all location associations for a specific identity
   * @param identityUniqueId - The unique identifier of the identity
   * @param identityType - The type of identity
   * @param params - Optional filtering by location, role, presence, and pagination
   * @returns Paginated result of LocationIdentity records for the given identity
   */
  listByIdentity(identityUniqueId: string, identityType: string, params?: ListLocationIdentitiesParams): Promise<PageResult<LocationIdentity>>;

  /**
   * Get the current location of an identity
   * @param identityUniqueId - The unique identifier of the identity
   * @param identityType - The type of identity
   * @returns The current LocationIdentity record, or null if not checked in anywhere
   * @note Returns null instead of throwing when no current location exists
   */
  getCurrentLocation(identityUniqueId: string, identityType: string): Promise<LocationIdentity | null>;
}

export function createLocationIdentitiesService(transport: Transport, _config: { apiKey: string }): LocationIdentitiesService {
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
