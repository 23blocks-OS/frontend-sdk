import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Category extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  parentId?: string;
  parentUniqueId?: string;

  // Display
  displayOrder?: number;
  iconUrl?: string;
  imageUrl?: string;
  contentUrl?: string;
  slug?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // SEO
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;

  // Source tracking
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // Extra
  payload?: Record<string, unknown>;

  // Nested
  children?: Category[];
  postCount?: number;
}

// Request types
export interface CreateCategoryRequest {
  name: string;
  description?: string;
  parentUniqueId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  parentUniqueId?: string;
  displayOrder?: number;
  imageUrl?: string;
  iconUrl?: string;
  enabled?: boolean;
  status?: EntityStatus;
}

export interface ListCategoriesParams {
  page?: number;
  perPage?: number;
  parentUniqueId?: string;
  withChildren?: boolean;
  withPosts?: boolean;
}
