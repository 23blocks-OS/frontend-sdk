import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface Student extends IdentityCore {
  userUniqueId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListStudentsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RegisterStudentRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateStudentRequest {
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface StudentAvailability {
  uniqueId: string;
  studentUniqueId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
}
