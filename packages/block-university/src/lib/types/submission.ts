import type { IdentityCore } from '@23blocks/contracts';

export type SubmissionStatus = 'submitted' | 'grading' | 'graded';

export interface Submission extends IdentityCore {
  assignmentUniqueId: string;
  userUniqueId: string;
  content?: string;
  contentUrl?: string;
  score?: number;
  feedback?: string;
  submittedAt?: Date;
  gradedAt?: Date;
  status: SubmissionStatus;
  payload?: Record<string, unknown>;
}

// Request types
export interface SubmitAssignmentRequest {
  assignmentUniqueId: string;
  content?: string;
  contentUrl?: string;
}

export interface GradeSubmissionRequest {
  score: number;
  feedback?: string;
}

export interface ListSubmissionsParams {
  page?: number;
  perPage?: number;
  status?: SubmissionStatus;
  assignmentUniqueId?: string;
  userUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
