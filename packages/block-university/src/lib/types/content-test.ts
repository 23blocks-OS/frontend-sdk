import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

export interface ContentTest extends IdentityCore {
  name: string;
  description?: string;
  courseUniqueId?: string;
  subjectUniqueId?: string;
  lessonUniqueId?: string;
  testType?: string;
  passingScore?: number;
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TestQuestion extends IdentityCore {
  testUniqueId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points?: number;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

export interface TestOption extends IdentityCore {
  questionUniqueId: string;
  optionText: string;
  isCorrect: boolean;
  sortOrder?: number;
}

export interface CreateContentTestRequest {
  name: string;
  description?: string;
  courseUniqueId?: string;
  subjectUniqueId?: string;
  lessonUniqueId?: string;
  testType?: string;
  passingScore?: number;
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateContentTestRequest {
  name?: string;
  description?: string;
  testType?: string;
  passingScore?: number;
  timeLimit?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateQuestionRequest {
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';
  points?: number;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

export interface CreateOptionRequest {
  optionText: string;
  isCorrect?: boolean;
  sortOrder?: number;
}

export interface ListContentTestsParams {
  page?: number;
  perPage?: number;
  status?: string;
  courseUniqueId?: string;
  subjectUniqueId?: string;
  lessonUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
