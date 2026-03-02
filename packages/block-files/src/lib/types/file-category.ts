import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface FileCategory extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  displayOrder?: number;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateFileCategoryRequest {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  displayOrder?: number;
}

export interface UpdateFileCategoryRequest {
  name?: string;
  description?: string;
  parentId?: string;
  thumbnailUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  displayOrder?: number;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface ListFileCategoriesParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
