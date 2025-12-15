import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface CourseGroup extends IdentityCore {
  courseUniqueId?: string;
  name: string;
  description?: string;
  maxStudents?: number;
  currentStudents?: number;
  startDate?: Date;
  endDate?: Date;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCourseGroupRequest {
  courseUniqueId: string;
  name: string;
  description?: string;
  maxStudents?: number;
  startDate?: Date;
  endDate?: Date;
  payload?: Record<string, unknown>;
}

export interface ListCourseGroupsParams {
  page?: number;
  perPage?: number;
  status?: string;
  courseUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
