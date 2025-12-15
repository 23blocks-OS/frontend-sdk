import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface Teacher extends IdentityCore {
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  specialization?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListTeachersParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TeacherAvailability {
  uniqueId: string;
  teacherUniqueId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
}

export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
}

export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  timezone?: string;
}
