/**
 * Geo lookup query params
 */
export interface GeoLookupParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Country info for geo lookups
 */
export interface GeoCountry {
  code: string;
  name: string;
  iso3?: string;
  phoneCode?: string;
  capital?: string;
  currency?: string;
  locationsCount?: number;
}

/**
 * State info for geo lookups
 */
export interface GeoState {
  code: string;
  name: string;
  countryCode: string;
  countryName?: string;
  locationsCount?: number;
}

/**
 * City info for geo lookups
 */
export interface GeoCity {
  code: string;
  name: string;
  stateCode?: string;
  stateName?: string;
  countryCode: string;
  countryName?: string;
  locationsCount?: number;
  latitude?: number;
  longitude?: number;
}
