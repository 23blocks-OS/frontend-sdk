import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Address extends IdentityCore {
  ownerUniqueId?: string;
  ownerType?: string;
  countryCode?: string;
  countryName?: string;
  admin1Code?: string;
  admin1Name?: string;
  admin2Code?: string;
  admin2Name?: string;
  admin3Code?: string;
  admin3Name?: string;
  admin4Code?: string;
  admin4Name?: string;
  admin5Code?: string;
  admin5Name?: string;
  admin6Code?: string;
  admin6Name?: string;
  postalCode?: string;
  address?: string;
  premise?: string;
  code?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  latitude?: number;
  longitude?: number;
  qcode?: string;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  defaultAddress?: boolean;
  tags?: string[];
}

// Request types
export interface CreateAddressRequest {
  ownerUniqueId?: string;
  ownerType?: string;
  countryCode?: string;
  address: string;
  postalCode?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  latitude?: number;
  longitude?: number;
  defaultAddress?: boolean;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateAddressRequest {
  countryCode?: string;
  address?: string;
  postalCode?: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  latitude?: number;
  longitude?: number;
  enabled?: boolean;
  status?: EntityStatus;
  defaultAddress?: boolean;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface ListAddressesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  ownerUniqueId?: string;
  ownerType?: string;
  countryCode?: string;
  defaultOnly?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
