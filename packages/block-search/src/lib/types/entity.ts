import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface SearchEntity extends IdentityCore {
  entityType: string;
  alias?: string;
  description?: string;
  avatarUrl?: string;
  url?: string;
  source?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface EntityTypeSchema {
  entityType: string;
  fields: EntityFieldSchema[];
  description?: string;
}

export interface EntityFieldSchema {
  name: string;
  type: string;
  required?: boolean;
  searchable?: boolean;
  filterable?: boolean;
}

export interface RegisterEntityRequest {
  entityType: string;
  entityAlias?: string;
  content?: string;
  entityAvatarUrl?: string;
  entityUrl?: string;
  entitySource?: string;
  status?: EntityStatus;
  timeZone?: string;
  preferredLanguage?: string;
  slug?: string;
}

export interface UpdateEntityRequest {
  entityAlias?: string;
  content?: string;
  entityAvatarUrl?: string;
  entityUrl?: string;
  entitySource?: string;
  status?: EntityStatus;
  timeZone?: string;
  preferredLanguage?: string;
  slug?: string;
}

export interface ListEntitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  entityType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CopilotSearchRequest {
  include?: string[];
  exclude?: string[];
  page?: number;
  records?: number;
  sort?: string;
  partition?: string;
  key?: string;
  searchType?: string;
}
