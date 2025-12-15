import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface CoachingSession extends IdentityCore {
  teacherUniqueId: string;
  studentUniqueId: string;
  matchUniqueId?: string;
  scheduledAt: Date;
  duration?: number;
  status: EntityStatus;
  teacherConfirmed?: boolean;
  studentConfirmed?: boolean;
  teacherCheckedIn?: boolean;
  studentCheckedIn?: boolean;
  teacherNotes?: string;
  studentNotes?: string;
  adminNotes?: string;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateCoachingSessionRequest {
  teacherUniqueId: string;
  studentUniqueId: string;
  matchUniqueId?: string;
  scheduledAt: Date;
  duration?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateCoachingSessionRequest {
  scheduledAt?: Date;
  duration?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCoachingSessionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  teacherUniqueId?: string;
  studentUniqueId?: string;
  fromDate?: Date;
  toDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
