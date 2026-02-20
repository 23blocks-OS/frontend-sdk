import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductFilter extends IdentityCore {
  name: string;
  filterKey: string;
  filterType: 'select' | 'range' | 'boolean' | 'text';
  options?: string[];
  minValue?: number;
  maxValue?: number;
  sortOrder?: number;
  isActive: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateProductFilterRequest {
  name: string;
  filterKey: string;
  filterType: 'select' | 'range' | 'boolean' | 'text';
  options?: string[];
  minValue?: number;
  maxValue?: number;
  sortOrder?: number;
  isActive?: boolean;
  payload?: Record<string, unknown>;
}

export interface ListProductFiltersParams {
  page?: number;
  perPage?: number;
  status?: string;
  filterType?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UpdateProductFilterRequest {
  name?: string;
  filterKey?: string;
  filterType?: 'select' | 'range' | 'boolean' | 'text';
  options?: string[];
  minValue?: number;
  maxValue?: number;
  sortOrder?: number;
  isActive?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}
