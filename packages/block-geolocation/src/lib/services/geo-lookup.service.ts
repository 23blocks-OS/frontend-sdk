import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type { Location, ListLocationsParams } from '../types/location';
import type { GeoLookupParams, GeoCountry, GeoState, GeoCity } from '../types/geo-lookup';
import { locationMapper } from '../mappers/location.mapper';
import { geoCountryMapper, geoStateMapper, geoCityMapper } from '../mappers/geo-lookup.mapper';

/**
 * Geo Countries Service - Lookup locations by country
 */
export interface GeoCountriesService {
  /**
   * List all countries with locations
   */
  list(params?: GeoLookupParams): Promise<PageResult<GeoCountry>>;

  /**
   * Get locations in a specific country
   */
  getLocations(countryCode: string, params?: ListLocationsParams): Promise<PageResult<Location>>;
}

/**
 * Geo States Service - Lookup locations by state/province
 */
export interface GeoStatesService {
  /**
   * List all states with locations
   */
  list(params?: GeoLookupParams): Promise<PageResult<GeoState>>;

  /**
   * List states in a specific country
   */
  listByCountry(countryCode: string, params?: GeoLookupParams): Promise<PageResult<GeoState>>;

  /**
   * Get locations in a specific state
   */
  getLocations(stateCode: string, params?: ListLocationsParams): Promise<PageResult<Location>>;
}

/**
 * Geo Cities Service - Lookup locations by city
 */
export interface GeoCitiesService {
  /**
   * List all cities with locations
   */
  list(params?: GeoLookupParams): Promise<PageResult<GeoCity>>;

  /**
   * List cities in a specific country
   */
  listByCountry(countryCode: string, params?: GeoLookupParams): Promise<PageResult<GeoCity>>;

  /**
   * List cities in a specific state
   */
  listByState(stateCode: string, params?: GeoLookupParams): Promise<PageResult<GeoCity>>;

  /**
   * Get locations in a specific city
   */
  getLocations(cityCode: string, params?: ListLocationsParams): Promise<PageResult<Location>>;
}

/**
 * Create the Geo Countries service
 */
export function createGeoCountriesService(
  transport: Transport,
  _config: { appId: string }
): GeoCountriesService {
  return {
    async list(params?: GeoLookupParams): Promise<PageResult<GeoCountry>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/countries', { params: queryParams });
      return decodePageResult(response, geoCountryMapper);
    },

    async getLocations(countryCode: string, params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/countries/${countryCode}/locations`, {
        params: queryParams,
      });
      return decodePageResult(response, locationMapper);
    },
  };
}

/**
 * Create the Geo States service
 */
export function createGeoStatesService(
  transport: Transport,
  _config: { appId: string }
): GeoStatesService {
  return {
    async list(params?: GeoLookupParams): Promise<PageResult<GeoState>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/states', { params: queryParams });
      return decodePageResult(response, geoStateMapper);
    },

    async listByCountry(countryCode: string, params?: GeoLookupParams): Promise<PageResult<GeoState>> {
      const queryParams: Record<string, string> = {
        country_code: countryCode,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/states', { params: queryParams });
      return decodePageResult(response, geoStateMapper);
    },

    async getLocations(stateCode: string, params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/states/${stateCode}/locations`, {
        params: queryParams,
      });
      return decodePageResult(response, locationMapper);
    },
  };
}

/**
 * Create the Geo Cities service
 */
export function createGeoCitiesService(
  transport: Transport,
  _config: { appId: string }
): GeoCitiesService {
  return {
    async list(params?: GeoLookupParams): Promise<PageResult<GeoCity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/cities', { params: queryParams });
      return decodePageResult(response, geoCityMapper);
    },

    async listByCountry(countryCode: string, params?: GeoLookupParams): Promise<PageResult<GeoCity>> {
      const queryParams: Record<string, string> = {
        country_code: countryCode,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/cities', { params: queryParams });
      return decodePageResult(response, geoCityMapper);
    },

    async listByState(stateCode: string, params?: GeoLookupParams): Promise<PageResult<GeoCity>> {
      const queryParams: Record<string, string> = {
        state_code: stateCode,
      };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/cities', { params: queryParams });
      return decodePageResult(response, geoCityMapper);
    },

    async getLocations(cityCode: string, params?: ListLocationsParams): Promise<PageResult<Location>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/cities/${cityCode}/locations`, {
        params: queryParams,
      });
      return decodePageResult(response, locationMapper);
    },
  };
}
