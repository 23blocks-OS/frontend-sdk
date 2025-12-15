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
  createdAt?: Date;
  updatedAt?: Date;
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
  alias?: string;
  description?: string;
  avatarUrl?: string;
  url?: string;
  source?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateEntityRequest {
  alias?: string;
  description?: string;
  avatarUrl?: string;
  url?: string;
  source?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
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
  query: string;
  entityTypes?: string[];
  limit?: number;
}
