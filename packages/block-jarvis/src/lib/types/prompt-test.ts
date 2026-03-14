export interface PromptTest {
  id: string;
  uniqueId: string;
  promptUniqueId: string;
  name: string;
  description?: string;
  input?: string;
  expectedOutput?: string;
  variables?: Record<string, unknown>;
  enabled?: boolean;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptTestRequest {
  name: string;
  description?: string;
  input?: string;
  expectedOutput?: string;
  variables?: Record<string, unknown>;
  enabled?: boolean;
}

export type UpdatePromptTestRequest = CreatePromptTestRequest;

export interface ListPromptTestsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PromptTestResult {
  id: string;
  uniqueId: string;
  testUniqueId: string;
  promptUniqueId: string;
  versionUniqueId?: string;
  input?: string;
  expectedOutput?: string;
  actualOutput?: string;
  passed?: boolean;
  score?: number;
  tokens?: number;
  cost?: number;
  duration?: number;
  error?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPromptTestResultsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PromptTestEvaluation {
  id: string;
  uniqueId: string;
  name?: string;
  description?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePromptTestEvaluationRequest {
  name?: string;
  description?: string;
}

export interface CompareVersionsRequest {
  versionA: string;
  versionB: string;
}

export interface CompareVersionsResponse {
  versionA: string;
  versionB: string;
  results: unknown[];
}
