import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Region extends IdentityCore {
  name: string;
  code?: string;
  description?: string;
  notes?: string;
  countryCode?: string;
  countryName?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  tags?: string[];
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  status: EntityStatus;
  enabled: boolean;
  qcode?: string;
}

// Request types
export interface CreateRegionRequest {
  name: string;
  code?: string;
  description?: string;
  notes?: string;
  countryCode?: string;
  countryName?: string;
  imageUrl?: string;
  tags?: string[];
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
}

export interface UpdateRegionRequest {
  name?: string;
  code?: string;
  description?: string;
  notes?: string;
  countryCode?: string;
  countryName?: string;
  imageUrl?: string;
  contentUrl?: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  iconUrl?: string;
  tags?: string[];
  enabled?: boolean;
  status?: EntityStatus;
}

export interface ListRegionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  countryCode?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
