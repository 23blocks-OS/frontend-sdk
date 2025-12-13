import type { IdentityCore } from '@23blocks/contracts';

export type ExecutionStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface Execution extends IdentityCore {
  agentUniqueId?: string;
  promptUniqueId?: string;
  input?: string;
  output?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
  status: ExecutionStatus;
  startedAt?: Date;
  completedAt?: Date;
  payload?: Record<string, unknown>;
}

// Request types
export interface ListExecutionsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  promptUniqueId?: string;
  status?: ExecutionStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
