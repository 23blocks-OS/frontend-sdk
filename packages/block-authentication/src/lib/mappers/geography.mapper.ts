import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EntityStatus } from '@23blocks/contracts';
import type { Country, State, County, City, Currency } from '../types/index.js';
import { parseString, parseDate } from './utils.js';

/**
 * Mapper for Country resources
 */
export const countryMapper: ResourceMapper<Country> = {
  type: 'countries',

  map(resource: JsonApiResource, _included: IncludedMap): Country {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      countryUniqueId: String(attrs.country_unique_id ?? resource.id),
      name: String(attrs.name ?? ''),
      areaCode: parseString(attrs.area_code),
      isoCode: parseString(attrs.iso_code),
      capital: parseString(attrs.capital),
      continent: parseString(attrs.continent),
      tld: parseString(attrs.tld),
      currencyCode: parseString(attrs.currency_code),
      currencyName: parseString(attrs.currency_name),
      postalCodeFormat: parseString(attrs.postal_code_format),
      postalCodeRegex: parseString(attrs.postal_code_regex),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      language: parseString(attrs.language),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for State resources
 */
export const stateMapper: ResourceMapper<State> = {
  type: 'states',

  map(resource: JsonApiResource, _included: IncludedMap): State {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      stateUniqueId: String(attrs.state_unique_id ?? resource.id),
      name: String(attrs.name ?? ''),
      abbreviation: parseString(attrs.abbreviation),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      language: parseString(attrs.language),
      countryName: parseString(attrs.country_name),
      countryId: parseString(attrs.country_id),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for County resources
 */
export const countyMapper: ResourceMapper<County> = {
  type: 'counties',

  map(resource: JsonApiResource, _included: IncludedMap): County {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      countyUniqueId: String(attrs.county_unique_id ?? resource.id),
      name: String(attrs.name ?? ''),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      stateName: parseString(attrs.state_name),
      stateId: parseString(attrs.state_id),
      language: parseString(attrs.language),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for City resources
 */
export const cityMapper: ResourceMapper<City> = {
  type: 'cities',

  map(resource: JsonApiResource, _included: IncludedMap): City {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      name: String(attrs.name ?? ''),
      stateName: parseString(attrs.state_name),
      stateId: parseString(attrs.state_id),
      countryName: parseString(attrs.country_name),
      countryId: parseString(attrs.country_id),
      countyName: parseString(attrs.county_name),
      countyId: parseString(attrs.county_id),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      language: parseString(attrs.language),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};

/**
 * Mapper for Currency resources
 */
export const currencyMapper: ResourceMapper<Currency> = {
  type: 'currencies',

  map(resource: JsonApiResource, _included: IncludedMap): Currency {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) ?? resource.id,
      createdAt: parseDate(attrs.created_at) ?? new Date(),
      updatedAt: parseDate(attrs.updated_at) ?? new Date(),
      currencyUniqueId: String(attrs.currency_unique_id ?? resource.id),
      code: String(attrs.code ?? ''),
      name: String(attrs.name ?? ''),
      symbol: parseString(attrs.symbol),
      status: (parseString(attrs.status) ?? 'active') as EntityStatus,
      language: parseString(attrs.language),
      payload: attrs.payload as Record<string, unknown> | null,
    };
  },
};
