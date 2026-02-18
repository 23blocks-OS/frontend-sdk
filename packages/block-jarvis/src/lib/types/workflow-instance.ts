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

/** Matches user_params + data_params in workflow_instances_controller.rb (create) */
export interface StartWorkflowRequest {
  userUniqueId?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
}

/** Matches steps_params in workflow_instances_controller.rb (step, log_step) */
export interface StepWorkflowRequest {
  stepUniqueId?: string;
  stepParams?: Record<string, unknown>;
  stepStatus?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  redirectUrl?: string;
}

export type LogWorkflowStepRequest = StepWorkflowRequest;

/** Matches execute_params in workflow_instances_controller.rb (execute_step) */
export interface ExecuteStepRequest {
  placeholders?: Record<string, unknown>;
}

/** Matches execute_next_params in workflow_instances_controller.rb (execute_next_step) */
export interface ExecuteNextStepRequest {
  transitionUniqueId?: string;
  placeholders?: Record<string, unknown>;
}
