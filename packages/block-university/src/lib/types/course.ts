import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Course extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  instructorUniqueId?: string;
  categoryUniqueId?: string;
  level?: string;
  duration?: number;
  imageUrl?: string;
  price?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCourseRequest {
  code: string;
  name: string;
  description?: string;
  instructorUniqueId?: string;
  categoryUniqueId?: string;
  level?: string;
  duration?: number;
  imageUrl?: string;
  price?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  instructorUniqueId?: string;
  categoryUniqueId?: string;
  level?: string;
  duration?: number;
  imageUrl?: string;
  price?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCoursesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  categoryUniqueId?: string;
  instructorUniqueId?: string;
  level?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
