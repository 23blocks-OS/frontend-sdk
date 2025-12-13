import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

/**
 * Country
 */
export interface Country extends IdentityCore {
  countryUniqueId: string;
  name: string;
  areaCode: string | null;
  isoCode: string | null;
  capital: string | null;
  continent: string | null;
  tld: string | null;
  currencyCode: string | null;
  currencyName: string | null;
  postalCodeFormat: string | null;
  postalCodeRegex: string | null;
  status: EntityStatus;
  language: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * State/Province
 */
export interface State extends IdentityCore {
  stateUniqueId: string;
  name: string;
  abbreviation: string | null;
  status: EntityStatus;
  language: string | null;
  countryName: string | null;
  countryId: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * County
 */
export interface County extends IdentityCore {
  countyUniqueId: string;
  name: string;
  status: EntityStatus;
  stateName: string | null;
  stateId: string | null;
  language: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * City
 */
export interface City extends IdentityCore {
  name: string;
  stateName: string | null;
  stateId: string | null;
  countryName: string | null;
  countryId: string | null;
  countyName: string | null;
  countyId: string | null;
  status: EntityStatus;
  language: string | null;
  payload: Record<string, unknown> | null;
}

/**
 * Currency
 */
export interface Currency extends IdentityCore {
  currencyUniqueId: string;
  code: string;
  name: string;
  symbol: string | null;
  status: EntityStatus;
  language: string | null;
  payload: Record<string, unknown> | null;
}
