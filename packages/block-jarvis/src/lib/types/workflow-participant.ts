export interface WorkflowParticipant {
  id: string;
  uniqueId: string;
  workflowUniqueId: string;
  entityType: string;
  entityUniqueId: string;
  role?: string;
  permissions?: string[];
  enabled: boolean;
  status: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddWorkflowParticipantRequest {
  entityType: string;
  entityUniqueId: string;
  role?: string;
  permissions?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateWorkflowParticipantRequest {
  role?: string;
  permissions?: string[];
  enabled?: boolean;
  status?: string;
  payload?: Record<string, unknown>;
}

export interface ListWorkflowParticipantsParams {
  page?: number;
  perPage?: number;
  entityType?: string;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
