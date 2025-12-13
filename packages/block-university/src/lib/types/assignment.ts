import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Assignment extends IdentityCore {
  lessonUniqueId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  maxScore?: number;
  submissionType?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateAssignmentRequest {
  lessonUniqueId: string;
  title: string;
  description?: string;
  dueDate?: Date;
  maxScore?: number;
  submissionType?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAssignmentRequest {
  title?: string;
  description?: string;
  dueDate?: Date;
  maxScore?: number;
  submissionType?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAssignmentsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  lessonUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
