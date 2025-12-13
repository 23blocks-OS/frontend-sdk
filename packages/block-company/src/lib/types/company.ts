import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Company extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  legalName?: string;
  taxId?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateCompanyRequest {
  code: string;
  name: string;
  description?: string;
  legalName?: string;
  taxId?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  legalName?: string;
  taxId?: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCompaniesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
