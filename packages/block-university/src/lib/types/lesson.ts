import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type LessonContentType = 'video' | 'text' | 'quiz';

export interface Lesson extends IdentityCore {
  courseUniqueId: string;
  code: string;
  name: string;
  description?: string;
  content?: string;
  contentType?: LessonContentType;
  contentUrl?: string;
  duration?: number;
  displayOrder?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateLessonRequest {
  courseUniqueId: string;
  code: string;
  name: string;
  description?: string;
  content?: string;
  contentType?: LessonContentType;
  contentUrl?: string;
  duration?: number;
  displayOrder?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateLessonRequest {
  name?: string;
  description?: string;
  content?: string;
  contentType?: LessonContentType;
  contentUrl?: string;
  duration?: number;
  displayOrder?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLessonsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  courseUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ReorderLessonsRequest {
  lessonUniqueIds: string[];
}
