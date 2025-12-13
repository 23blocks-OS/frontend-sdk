import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Quarter extends IdentityCore {
  companyUniqueId: string;
  name: string;
  year: number;
  quarter: number;
  startDate: Date;
  endDate: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateQuarterRequest {
  companyUniqueId: string;
  name: string;
  year: number;
  quarter: number;
  startDate: Date | string;
  endDate: Date | string;
  payload?: Record<string, unknown>;
}

export interface UpdateQuarterRequest {
  name?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListQuartersParams {
  page?: number;
  perPage?: number;
  companyUniqueId?: string;
  year?: number;
  quarter?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
