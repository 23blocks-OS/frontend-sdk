import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Vendor extends IdentityCore {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateVendorRequest {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateVendorRequest {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListVendorsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
}
