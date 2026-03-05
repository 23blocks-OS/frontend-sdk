import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ProductFilter extends IdentityCore {
  name: string;
  value?: string;
  order?: number;
  iconUrl?: string;
  imageUrl?: string;
  language?: string;
  status: EntityStatus;
}

export interface CreateProductFilterRequest {
  name: string;
  value?: string;
  order?: number;
  iconUrl?: string;
  imageUrl?: string;
  language?: string;
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
  value?: string;
  order?: number;
  iconUrl?: string;
  imageUrl?: string;
  language?: string;
  status?: EntityStatus;
}
