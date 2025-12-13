import type { Transport, PageResult, ListParams } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type { Country, State, County, City, Currency } from '../types/index.js';
import {
  countryMapper,
  stateMapper,
  countyMapper,
  cityMapper,
  currencyMapper,
} from '../mappers/index.js';
import type { AuthenticationBlockConfig } from '../authentication.block.js';

/**
 * Countries service interface
 */
export interface CountriesService {
  /**
   * List countries
   */
  list(params?: ListParams): Promise<PageResult<Country>>;

  /**
   * Get a country by ID
   */
  get(id: string): Promise<Country>;

  /**
   * Get a country by ISO code
   */
  getByIsoCode(isoCode: string): Promise<Country>;

  /**
   * Get all countries (no pagination)
   */
  all(): Promise<Country[]>;
}

/**
 * States service interface
 */
export interface StatesService {
  /**
   * List states
   */
  list(params?: ListParams): Promise<PageResult<State>>;

  /**
   * Get a state by ID
   */
  get(id: string): Promise<State>;

  /**
   * Get states for a country
   */
  forCountry(countryId: string): Promise<State[]>;
}

/**
 * Counties service interface
 */
export interface CountiesService {
  /**
   * List counties
   */
  list(params?: ListParams): Promise<PageResult<County>>;

  /**
   * Get a county by ID
   */
  get(id: string): Promise<County>;

  /**
   * Get counties for a state
   */
  forState(stateId: string): Promise<County[]>;
}

/**
 * Cities service interface
 */
export interface CitiesService {
  /**
   * List cities
   */
  list(params?: ListParams): Promise<PageResult<City>>;

  /**
   * Get a city by ID
   */
  get(id: string): Promise<City>;

  /**
   * Get cities for a state
   */
  forState(stateId: string): Promise<City[]>;

  /**
   * Get cities for a county
   */
  forCounty(countyId: string): Promise<City[]>;

  /**
   * Search cities by name
   */
  search(query: string, params?: ListParams): Promise<PageResult<City>>;
}

/**
 * Currencies service interface
 */
export interface CurrenciesService {
  /**
   * List currencies
   */
  list(params?: ListParams): Promise<PageResult<Currency>>;

  /**
   * Get a currency by ID
   */
  get(id: string): Promise<Currency>;

  /**
   * Get a currency by code
   */
  getByCode(code: string): Promise<Currency>;

  /**
   * Get all currencies (no pagination)
   */
  all(): Promise<Currency[]>;
}

/**
 * Build filter params for list operations
 */
function buildListParams(params?: ListParams): Record<string, string | number | boolean | string[] | undefined> {
  if (!params) return {};

  const queryParams: Record<string, string | number | boolean | string[] | undefined> = {};

  if (params.page) {
    queryParams['page[number]'] = params.page;
  }
  if (params.perPage) {
    queryParams['page[size]'] = params.perPage;
  }

  if (params.sort) {
    const sorts = Array.isArray(params.sort) ? params.sort : [params.sort];
    queryParams['sort'] = sorts
      .map((s) => (s.direction === 'desc' ? `-${s.field}` : s.field))
      .join(',');
  }

  if (params.filter) {
    for (const [key, value] of Object.entries(params.filter)) {
      queryParams[`filter[${key}]`] = value;
    }
  }

  if (params.include) {
    queryParams['include'] = params.include.join(',');
  }

  return queryParams;
}

/**
 * Create the countries service
 */
export function createCountriesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): CountriesService {
  return {
    async list(params?: ListParams): Promise<PageResult<Country>> {
      const response = await transport.get<JsonApiDocument>(
        '/countries',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, countryMapper);
    },

    async get(id: string): Promise<Country> {
      const response = await transport.get<JsonApiDocument>(`/countries/${id}`);
      return decodeOne(response, countryMapper);
    },

    async getByIsoCode(isoCode: string): Promise<Country> {
      const response = await transport.get<JsonApiDocument>(
        `/countries/by_iso_code/${isoCode}`
      );
      return decodeOne(response, countryMapper);
    },

    async all(): Promise<Country[]> {
      const response = await transport.get<JsonApiDocument>(
        '/countries/all'
      );
      return decodeMany(response, countryMapper);
    },
  };
}

/**
 * Create the states service
 */
export function createStatesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): StatesService {
  return {
    async list(params?: ListParams): Promise<PageResult<State>> {
      const response = await transport.get<JsonApiDocument>(
        '/states',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, stateMapper);
    },

    async get(id: string): Promise<State> {
      const response = await transport.get<JsonApiDocument>(`/states/${id}`);
      return decodeOne(response, stateMapper);
    },

    async forCountry(countryId: string): Promise<State[]> {
      const response = await transport.get<JsonApiDocument>(
        `/countries/${countryId}/states`
      );
      return decodeMany(response, stateMapper);
    },
  };
}

/**
 * Create the counties service
 */
export function createCountiesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): CountiesService {
  return {
    async list(params?: ListParams): Promise<PageResult<County>> {
      const response = await transport.get<JsonApiDocument>(
        '/counties',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, countyMapper);
    },

    async get(id: string): Promise<County> {
      const response = await transport.get<JsonApiDocument>(`/counties/${id}`);
      return decodeOne(response, countyMapper);
    },

    async forState(stateId: string): Promise<County[]> {
      const response = await transport.get<JsonApiDocument>(
        `/states/${stateId}/counties`
      );
      return decodeMany(response, countyMapper);
    },
  };
}

/**
 * Create the cities service
 */
export function createCitiesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): CitiesService {
  return {
    async list(params?: ListParams): Promise<PageResult<City>> {
      const response = await transport.get<JsonApiDocument>(
        '/cities',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, cityMapper);
    },

    async get(id: string): Promise<City> {
      const response = await transport.get<JsonApiDocument>(`/cities/${id}`);
      return decodeOne(response, cityMapper);
    },

    async forState(stateId: string): Promise<City[]> {
      const response = await transport.get<JsonApiDocument>(
        `/states/${stateId}/cities`
      );
      return decodeMany(response, cityMapper);
    },

    async forCounty(countyId: string): Promise<City[]> {
      const response = await transport.get<JsonApiDocument>(
        `/counties/${countyId}/cities`
      );
      return decodeMany(response, cityMapper);
    },

    async search(query: string, params?: ListParams): Promise<PageResult<City>> {
      const queryParams = buildListParams(params);
      queryParams['q'] = query;

      const response = await transport.get<JsonApiDocument>(
        '/cities/search',
        { params: queryParams }
      );
      return decodePageResult(response, cityMapper);
    },
  };
}

/**
 * Create the currencies service
 */
export function createCurrenciesService(
  transport: Transport,
  _config: AuthenticationBlockConfig
): CurrenciesService {
  return {
    async list(params?: ListParams): Promise<PageResult<Currency>> {
      const response = await transport.get<JsonApiDocument>(
        '/currencies',
        { params: buildListParams(params) }
      );
      return decodePageResult(response, currencyMapper);
    },

    async get(id: string): Promise<Currency> {
      const response = await transport.get<JsonApiDocument>(`/currencies/${id}`);
      return decodeOne(response, currencyMapper);
    },

    async getByCode(code: string): Promise<Currency> {
      const response = await transport.get<JsonApiDocument>(
        `/currencies/by_code/${code}`
      );
      return decodeOne(response, currencyMapper);
    },

    async all(): Promise<Currency[]> {
      const response = await transport.get<JsonApiDocument>(
        '/currencies/all'
      );
      return decodeMany(response, currencyMapper);
    },
  };
}
