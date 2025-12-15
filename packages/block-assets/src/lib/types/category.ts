import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Category extends IdentityCore {
  name: string;
  description?: string;
  parentUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  imageUrl?: string;
  payload?: Record<string, unknown>;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentUniqueId?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCategoriesParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  search?: string;
}

export interface CategoryPresignResponse {
  url: string;
  fields: Record<string, string>;
  key: string;
}

export interface CreateCategoryImageRequest {
  key: string;
  filename: string;
  contentType: string;
}

export interface CategoryImage {
  uniqueId: string;
  url: string;
  filename: string;
  contentType: string;
  createdAt: Date;
}
