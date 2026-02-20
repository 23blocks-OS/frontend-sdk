import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  GeoIdentity,
  RegisterGeoIdentityRequest,
  UpdateGeoIdentityRequest,
  ListGeoIdentitiesParams,
  LocationIdentityRequest,
  UserLocationRequest,
} from '../types/geo-identity.js';
import { geoIdentityMapper } from '../mappers/geo-identity.mapper.js';

export interface GeoIdentitiesService {
  /**
   * List all geo identities
   * @param params - Optional filtering by status, search, and pagination
   * @returns Paginated result containing GeoIdentity items and metadata
   */
  list(params?: ListGeoIdentitiesParams): Promise<PageResult<GeoIdentity>>;

  /**
   * Get a specific geo identity
   * @param uniqueId - The unique identifier of the geo identity
   * @returns The matching GeoIdentity record
   */
  get(uniqueId: string): Promise<GeoIdentity>;

  /**
   * Register a new geo identity for a user
   * @param uniqueId - The unique identifier of the user to register
   * @param data - Identity details including name, email, phone, and avatar
   * @returns The newly created GeoIdentity record
   */
  register(uniqueId: string, data: RegisterGeoIdentityRequest): Promise<GeoIdentity>;

  /**
   * Update a geo identity
   * @param uniqueId - The unique identifier of the geo identity to update
   * @param data - Fields to update such as name, email, phone, or status
   * @returns The updated GeoIdentity record
   */
  update(uniqueId: string, data: UpdateGeoIdentityRequest): Promise<GeoIdentity>;

  /**
   * Delete a geo identity
   * @param uniqueId - The unique identifier of the geo identity to delete
   * @returns Resolves when the identity has been deleted
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Add a user identity to a location
   * @param locationUniqueId - The unique identifier of the location
   * @param data - Identity association including user ID and role
   * @returns Resolves when the identity has been added to the location
   */
  addToLocation(locationUniqueId: string, data: LocationIdentityRequest): Promise<void>;

  /**
   * Remove a user identity from a location
   * @param locationUniqueId - The unique identifier of the location
   * @param userUniqueId - The unique identifier of the user to remove
   * @returns Resolves when the identity has been removed from the location
   */
  removeFromLocation(locationUniqueId: string, userUniqueId: string): Promise<void>;

  /**
   * Update the real-time location of a user
   * @param userUniqueId - The unique identifier of the user
   * @param data - GPS coordinates including latitude, longitude, accuracy, heading, and speed
   * @returns Resolves when the location has been updated
   */
  updateLocation(userUniqueId: string, data: UserLocationRequest): Promise<void>;
}

export function createGeoIdentitiesService(transport: Transport, _config: { apiKey: string }): GeoIdentitiesService {
  return {
    async list(params?: ListGeoIdentitiesParams): Promise<PageResult<GeoIdentity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/identities/', { params: queryParams });
      return decodePageResult(response, geoIdentityMapper);
    },

    async get(uniqueId: string): Promise<GeoIdentity> {
      const response = await transport.get<unknown>(`/identities/${uniqueId}/`);
      return decodeOne(response, geoIdentityMapper);
    },

    async register(uniqueId: string, data: RegisterGeoIdentityRequest): Promise<GeoIdentity> {
      const response = await transport.post<unknown>(`/identities/${uniqueId}/register/`, {
        user: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          payload: data.payload,
        },
      });
      return decodeOne(response, geoIdentityMapper);
    },

    async update(uniqueId: string, data: UpdateGeoIdentityRequest): Promise<GeoIdentity> {
      const response = await transport.put<unknown>(`/identities/${uniqueId}/`, {
        user: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          avatar_url: data.avatarUrl,
          status: data.status,
          payload: data.payload,
        },
      });
      return decodeOne(response, geoIdentityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/identities/${uniqueId}/`);
    },

    async addToLocation(locationUniqueId: string, data: LocationIdentityRequest): Promise<void> {
      await transport.post<unknown>(`/locations/${locationUniqueId}/identities`, {
        location_identity: {
          user_unique_id: data.userUniqueId,
          role: data.role,
        },
      });
    },

    async removeFromLocation(locationUniqueId: string, userUniqueId: string): Promise<void> {
      await transport.delete(`/locations/${locationUniqueId}/identities/${userUniqueId}`);
    },

    async updateLocation(userUniqueId: string, data: UserLocationRequest): Promise<void> {
      await transport.post<unknown>(`/users/${userUniqueId}/location`, {
        user_location: {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: data.accuracy,
          heading: data.heading,
          speed: data.speed,
          timestamp: data.timestamp instanceof Date ? data.timestamp.toISOString() : data.timestamp,
        },
      });
    },
  };
}
