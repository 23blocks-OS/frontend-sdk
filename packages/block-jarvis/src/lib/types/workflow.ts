import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface WorkflowStep {
  id: string;
  type: string;
  name: string;
  config?: Record<string, unknown>;
  nextSteps?: string[];
}

export interface WorkflowTrigger {
  type: string;
  config?: Record<string, unknown>;
}

export interface Workflow extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateWorkflowRequest {
  code: string;
  name: string;
  description?: string;
  steps: WorkflowStep[];
  triggers?: WorkflowTrigger[];
  payload?: Record<string, unknown>;
}

export interface UpdateWorkflowRequest {
  name?: string;
  description?: string;
  steps?: WorkflowStep[];
  triggers?: WorkflowTrigger[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListWorkflowsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface RunWorkflowRequest {
  input?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface RunWorkflowResponse {
  executionUniqueId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: Record<string, unknown>;
}
