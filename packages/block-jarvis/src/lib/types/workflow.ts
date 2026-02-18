export interface Workflow {
  id: string;
  uniqueId: string;
  name: string;
  description?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  status: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches workflow_params in workflows_controller.rb */
export interface CreateWorkflowRequest {
  name: string;
  description?: string;
  source?: string;
  sourceId?: string;
  sourceType?: string;
  sourceAlias?: string;
  contentUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  status?: string;
}

export type UpdateWorkflowRequest = CreateWorkflowRequest;

export interface ListWorkflowsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
