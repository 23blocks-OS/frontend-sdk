export interface Execution {
  id: string;
  uniqueId: string;
  agentUniqueId?: string;
  promptUniqueId?: string;
  input?: string;
  output?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
  status: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListExecutionsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  promptUniqueId?: string;
  runUniqueId?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
