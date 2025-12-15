import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  GeoIdentity,
  RegisterGeoIdentityRequest,
  UpdateGeoIdentityRequest,
  ListGeoIdentitiesParams,
  LocationIdentityRequest,
  UserLocationRequest,
} from '../types/geo-identity';
import { geoIdentityMapper } from '../mappers/geo-identity.mapper';

export interface GeoIdentitiesService {
  list(params?: ListGeoIdentitiesParams): Promise<PageResult<GeoIdentity>>;
  get(uniqueId: string): Promise<GeoIdentity>;
  register(uniqueId: string, data: RegisterGeoIdentityRequest): Promise<GeoIdentity>;
  update(uniqueId: string, data: UpdateGeoIdentityRequest): Promise<GeoIdentity>;
  delete(uniqueId: string): Promise<void>;
  addToLocation(locationUniqueId: string, data: LocationIdentityRequest): Promise<void>;
  removeFromLocation(locationUniqueId: string, userUniqueId: string): Promise<void>;
  updateLocation(userUniqueId: string, data: UserLocationRequest): Promise<void>;
}

export function createGeoIdentitiesService(transport: Transport, _config: { appId: string }): GeoIdentitiesService {
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
