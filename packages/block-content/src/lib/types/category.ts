import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Category extends IdentityCore {
  uniqueId: string;

  // Core fields from API
  code?: string;
  name: string;
  description?: string;

  // Hierarchy
  parentId?: string;

  // Display
  displayOrder?: number;
  imageUrl?: string;
  contentUrl?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // Extra
  payload?: Record<string, unknown>;

  // Nested (populated by includes)
  children?: Category[];
  postCount?: number;
}

// Request types
export interface CreateCategoryRequest {
  code?: string;
  name: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  imageUrl?: string;
  contentUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateCategoryRequest {
  code?: string;
  name?: string;
  description?: string;
  parentId?: string;
  displayOrder?: number;
  imageUrl?: string;
  contentUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCategoriesParams {
  page?: number;
  perPage?: number;
  parentId?: string;
  withChildren?: boolean;
  withPosts?: boolean;
}
