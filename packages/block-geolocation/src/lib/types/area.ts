import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Area extends IdentityCore {
  code?: string;
  name: string;
  addressUniqueId?: string;
  source?: string;
  areaType?: string;
  areaPoints?: string;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  tags?: string[];
}

// Request types
export interface CreateAreaRequest {
  name: string;
  code?: string;
  addressUniqueId?: string;
  source?: string;
  areaType?: string;
  areaPoints?: string;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateAreaRequest {
  name?: string;
  code?: string;
  addressUniqueId?: string;
  areaType?: string;
  areaPoints?: string;
  enabled?: boolean;
  status?: EntityStatus;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface ListAreasParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  areaType?: string;
  addressUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
