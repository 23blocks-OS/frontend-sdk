import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

/**
 * Match - coaching relationship between teacher and student
 */
export interface Match extends IdentityCore {
  teacherUniqueId: string;
  studentUniqueId: string;
  courseUniqueId?: string;
  subjectUniqueId?: string;
  status: 'pending' | 'active' | 'inactive' | 'completed';
  startedAt?: Date;
  endedAt?: Date;
  payload?: Record<string, unknown>;
}

/**
 * Match Evaluation - result of evaluating potential matches
 */
export interface MatchEvaluation {
  teacherUniqueId: string;
  studentUniqueId: string;
  score: number;
  availabilityOverlap: number;
  compatibilityFactors?: Record<string, unknown>;
}

/**
 * Available Coach - teacher available for coaching
 */
export interface AvailableCoach {
  teacherUniqueId: string;
  name?: string;
  email?: string;
  availabilityScore?: number;
  courseUniqueIds?: string[];
  subjectUniqueIds?: string[];
}

/**
 * Available Coachee - student seeking coaching
 */
export interface AvailableCoachee {
  studentUniqueId: string;
  name?: string;
  email?: string;
  availabilityScore?: number;
  courseUniqueIds?: string[];
  subjectUniqueIds?: string[];
}

/**
 * Create match request
 */
export interface CreateMatchRequest {
  teacherUniqueId: string;
  studentUniqueId: string;
  courseUniqueId?: string;
  subjectUniqueId?: string;
  payload?: Record<string, unknown>;
}

/**
 * Find coaches request
 */
export interface FindCoachesRequest {
  courseUniqueId?: string;
  subjectUniqueId?: string;
  availabilityRequired?: boolean;
  limit?: number;
}

/**
 * Find coachees request
 */
export interface FindCoacheesRequest {
  courseUniqueId?: string;
  subjectUniqueId?: string;
  availabilityRequired?: boolean;
  limit?: number;
}

/**
 * Evaluate matches request
 */
export interface EvaluateMatchesRequest {
  teacherUniqueIds?: string[];
  studentUniqueIds?: string[];
  courseUniqueId?: string;
}

/**
 * Evaluate availabilities request
 */
export interface EvaluateAvailabilitiesRequest {
  teacherUniqueId?: string;
  studentUniqueId?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * List matches params
 */
export interface ListMatchesParams {
  page?: number;
  perPage?: number;
  teacherUniqueId?: string;
  studentUniqueId?: string;
  courseUniqueId?: string;
  status?: string;
}
