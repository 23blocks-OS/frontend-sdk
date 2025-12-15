export interface WorkflowInstance {
  id: string;
  uniqueId: string;
  workflowUniqueId: string;
  currentStepUniqueId?: string;
  currentStepOrder: number;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  logs?: WorkflowStepLog[];
  status: string;
  startedAt?: Date;
  completedAt?: Date;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkflowStepLog {
  stepUniqueId: string;
  stepName: string;
  status: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  startedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface WorkflowInstanceDetails {
  instance: WorkflowInstance;
  workflow: {
    uniqueId: string;
    name: string;
  };
  steps: WorkflowStepStatus[];
}

export interface WorkflowStepStatus {
  stepUniqueId: string;
  stepName: string;
  order: number;
  status: string;
  startedAt?: Date;
  completedAt?: Date;
}

export interface StartWorkflowRequest {
  input?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface StartWorkflowResponse {
  instance: WorkflowInstance;
}

export interface StepWorkflowRequest {
  input?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface LogWorkflowStepRequest {
  stepUniqueId: string;
  status: string;
  output?: Record<string, unknown>;
  error?: string;
  payload?: Record<string, unknown>;
}
