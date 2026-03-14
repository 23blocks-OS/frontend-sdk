export interface AgentTest {
  id: string;
  uniqueId: string;
  agentUniqueId: string;
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

export interface CreateAgentTestRequest {
  name: string;
  description?: string;
  input?: string;
  expectedOutput?: string;
  variables?: Record<string, unknown>;
  enabled?: boolean;
}

export type UpdateAgentTestRequest = CreateAgentTestRequest;

export interface ListAgentTestsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AgentTestResult {
  id: string;
  uniqueId: string;
  testUniqueId: string;
  agentUniqueId: string;
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

export interface ListAgentTestResultsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
