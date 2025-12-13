import type { IdentityCore } from '@23blocks/contracts';

export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'dropped';

export interface Enrollment extends IdentityCore {
  courseUniqueId: string;
  userUniqueId: string;
  progress?: number;
  completedLessons?: number;
  startedAt?: Date;
  completedAt?: Date;
  certificateUrl?: string;
  status: EnrollmentStatus;
  payload?: Record<string, unknown>;
}

// Request types
export interface EnrollRequest {
  courseUniqueId: string;
  userUniqueId?: string;
}

export interface UpdateEnrollmentProgressRequest {
  lessonUniqueId: string;
  progress?: number;
}

export interface ListEnrollmentsParams {
  page?: number;
  perPage?: number;
  status?: EnrollmentStatus;
  courseUniqueId?: string;
  userUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
