import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { GeoCountry, GeoState, GeoCity } from '../types/geo-lookup';
import { parseString, parseNumber } from './utils';

export const geoCountryMapper: ResourceMapper<GeoCountry> = {
  type: 'geo_country',
  map: (resource) => ({
    code: parseString(resource.attributes?.['code']) ?? resource.id,
    name: parseString(resource.attributes?.['name']) ?? '',
    iso3: parseString(resource.attributes?.['iso3']),
    phoneCode: parseString(resource.attributes?.['phone_code']),
    capital: parseString(resource.attributes?.['capital']),
    currency: parseString(resource.attributes?.['currency']),
    locationsCount: parseNumber(resource.attributes?.['locations_count']),
  }),
};

export const geoStateMapper: ResourceMapper<GeoState> = {
  type: 'geo_state',
  map: (resource) => ({
    code: parseString(resource.attributes?.['code']) ?? resource.id,
    name: parseString(resource.attributes?.['name']) ?? '',
    countryCode: parseString(resource.attributes?.['country_code']) ?? '',
    countryName: parseString(resource.attributes?.['country_name']),
    locationsCount: parseNumber(resource.attributes?.['locations_count']),
  }),
};

export const geoCityMapper: ResourceMapper<GeoCity> = {
  type: 'geo_city',
  map: (resource) => ({
    code: parseString(resource.attributes?.['code']) ?? resource.id,
    name: parseString(resource.attributes?.['name']) ?? '',
    stateCode: parseString(resource.attributes?.['state_code']),
    stateName: parseString(resource.attributes?.['state_name']),
    countryCode: parseString(resource.attributes?.['country_code']) ?? '',
    countryName: parseString(resource.attributes?.['country_name']),
    locationsCount: parseNumber(resource.attributes?.['locations_count']),
    latitude: resource.attributes?.['latitude'] as number | undefined,
    longitude: resource.attributes?.['longitude'] as number | undefined,
  }),
};
