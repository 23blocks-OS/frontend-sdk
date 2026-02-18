import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  WorkflowParticipant,
  AddWorkflowParticipantRequest,
  UpdateWorkflowParticipantRequest,
  ListWorkflowParticipantsParams,
} from '../types/workflow-participant.js';
import { workflowParticipantMapper } from '../mappers/workflow-participant.mapper.js';

function buildParticipantBody(data: AddWorkflowParticipantRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.role) body['role'] = data.role;
  if (data.roleName) body['role_name'] = data.roleName;
  if (data.participantUniqueId) body['participant_unique_id'] = data.participantUniqueId;
  if (data.participantName) body['participant_name'] = data.participantName;
  if (data.status) body['status'] = data.status;
  return body;
}

export interface WorkflowParticipantsService {
  list(workflowUniqueId: string, params?: ListWorkflowParticipantsParams): Promise<PageResult<WorkflowParticipant>>;
  get(workflowUniqueId: string, uniqueId: string): Promise<WorkflowParticipant>;
  add(workflowUniqueId: string, data: AddWorkflowParticipantRequest): Promise<WorkflowParticipant>;
  update(workflowUniqueId: string, uniqueId: string, data: UpdateWorkflowParticipantRequest): Promise<WorkflowParticipant>;
  remove(workflowUniqueId: string, uniqueId: string): Promise<void>;
}

export function createWorkflowParticipantsService(transport: Transport, _config: { appId: string }): WorkflowParticipantsService {
  return {
    async list(workflowUniqueId: string, params?: ListWorkflowParticipantsParams): Promise<PageResult<WorkflowParticipant>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.role) queryParams['role'] = params.role;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/participants`, { params: queryParams });
      return decodePageResult(response, workflowParticipantMapper);
    },

    async get(workflowUniqueId: string, uniqueId: string): Promise<WorkflowParticipant> {
      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/participants/${uniqueId}`);
      return decodeOne(response, workflowParticipantMapper);
    },

    async add(workflowUniqueId: string, data: AddWorkflowParticipantRequest): Promise<WorkflowParticipant> {
      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/participants`, {
        workflow_participant: buildParticipantBody(data),
      });
      return decodeOne(response, workflowParticipantMapper);
    },

    async update(workflowUniqueId: string, uniqueId: string, data: UpdateWorkflowParticipantRequest): Promise<WorkflowParticipant> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/participants/${uniqueId}`, {
        workflow_participant: buildParticipantBody(data),
      });
      return decodeOne(response, workflowParticipantMapper);
    },

    async remove(workflowUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/workflows/${workflowUniqueId}/participants/${uniqueId}`);
    },
  };
}
