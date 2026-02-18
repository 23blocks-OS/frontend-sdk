export interface WorkflowParticipant {
  id: string;
  uniqueId: string;
  workflowUniqueId: string;
  role?: string;
  roleName?: string;
  participantUniqueId?: string;
  participantName?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches workflow_participant_params in workflow_participants_controller.rb */
export interface AddWorkflowParticipantRequest {
  role?: string;
  roleName?: string;
  participantUniqueId?: string;
  participantName?: string;
  status?: string;
}

export type UpdateWorkflowParticipantRequest = AddWorkflowParticipantRequest;

export interface ListWorkflowParticipantsParams {
  page?: number;
  perPage?: number;
  role?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
