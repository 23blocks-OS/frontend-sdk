import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CategoryImage extends IdentityCore {
  categoryUniqueId: string;
  name?: string;
  url?: string;
  thumbnail?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  originalName?: string;
  isPublic?: boolean;
  isMainImage?: boolean;
  aiEnabled?: boolean;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
}

export interface CreateCategoryImageRequest {
  name?: string;
  url?: string;
  thumbnail?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  originalName?: string;
  isPublic?: boolean;
  isMainImage?: boolean;
  aiEnabled?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateCategoryImageRequest {
  name?: string;
  url?: string;
  thumbnail?: string;
  fileType?: string;
  fileSize?: number;
  description?: string;
  originalName?: string;
  isPublic?: boolean;
  isMainImage?: boolean;
  aiEnabled?: boolean;
  payload?: Record<string, unknown>;
}
