import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

/**
 * Placement Test - main test entity for course placement
 */
export interface PlacementTest extends IdentityCore {
  name: string;
  description?: string;
  courseUniqueId: string;
  passingScore?: number;
  timeLimit?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  sections?: PlacementSection[];
}

/**
 * Placement Section - section within a placement test
 */
export interface PlacementSection extends IdentityCore {
  placementUniqueId: string;
  name: string;
  description?: string;
  sortOrder?: number;
  questions?: PlacementQuestion[];
}

/**
 * Placement Question - question within a placement section
 */
export interface PlacementQuestion extends IdentityCore {
  sectionUniqueId?: string;
  placementUniqueId: string;
  questionText: string;
  questionType?: string;
  points?: number;
  sortOrder?: number;
  payload?: Record<string, unknown>;
  options?: PlacementOption[];
}

/**
 * Placement Option - option for a placement question
 */
export interface PlacementOption extends IdentityCore {
  questionUniqueId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder?: number;
}

/**
 * Placement Rule - rule for placement based on score
 */
export interface PlacementRule extends IdentityCore {
  placementUniqueId: string;
  minScore: number;
  maxScore: number;
  courseGroupUniqueId?: string;
  subjectUniqueId?: string;
  action?: string;
  payload?: Record<string, unknown>;
}

/**
 * Placement Instance - user's placement test attempt
 */
export interface PlacementInstance extends IdentityCore {
  userUniqueId: string;
  placementUniqueId: string;
  status: 'started' | 'in_progress' | 'completed' | 'graded';
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  result?: Record<string, unknown>;
}

/**
 * Create placement test request
 */
export interface CreatePlacementRequest {
  name: string;
  description?: string;
  passingScore?: number;
  timeLimit?: number;
  payload?: Record<string, unknown>;
}

/**
 * Create section request
 */
export interface CreatePlacementSectionRequest {
  name: string;
  description?: string;
  sortOrder?: number;
}

/**
 * Create question request
 */
export interface CreatePlacementQuestionRequest {
  questionText: string;
  questionType?: string;
  points?: number;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

/**
 * Create option request
 */
export interface CreatePlacementOptionRequest {
  optionText: string;
  isCorrect?: boolean;
  sortOrder?: number;
}

/**
 * Create rule request
 */
export interface CreatePlacementRuleRequest {
  minScore: number;
  maxScore: number;
  courseGroupUniqueId?: string;
  subjectUniqueId?: string;
  action?: string;
  payload?: Record<string, unknown>;
}

/**
 * Placement response - answer to a placement question
 */
export interface PlacementResponse {
  questionUniqueId: string;
  optionUniqueId?: string;
  answer?: string;
}

/**
 * List placements params
 */
export interface ListPlacementsParams {
  page?: number;
  perPage?: number;
  courseUniqueId?: string;
  status?: string;
}
