import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  WorkflowInstance,
  WorkflowInstanceDetails,
  StartWorkflowRequest,
  StepWorkflowRequest,
  LogWorkflowStepRequest,
  ExecuteStepRequest,
  ExecuteNextStepRequest,
} from '../types/workflow-instance.js';
import { workflowInstanceMapper } from '../mappers/workflow-instance.mapper.js';

function buildStepBody(data: StepWorkflowRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.stepUniqueId) body['step_unique_id'] = data.stepUniqueId;
  if (data.stepParams) body['step_params'] = data.stepParams;
  if (data.stepStatus) body['step_status'] = data.stepStatus;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.redirectUrl) body['redirect_url'] = data.redirectUrl;
  return body;
}

export interface WorkflowInstancesService {
  start(workflowUniqueId: string, data?: StartWorkflowRequest): Promise<WorkflowInstance>;
  get(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
  getDetails(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstanceDetails>;
  step(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Promise<WorkflowInstance>;
  logStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Promise<WorkflowInstance>;
  executeStep(workflowUniqueId: string, instanceUniqueId: string, data?: ExecuteStepRequest): Promise<WorkflowInstance>;
  executeNextStep(workflowUniqueId: string, instanceUniqueId: string, data?: ExecuteNextStepRequest): Promise<WorkflowInstance>;
  suspend(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
  resume(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
}

export function createWorkflowInstancesService(transport: Transport, _config: { apiKey: string }): WorkflowInstancesService {
  return {
    async start(workflowUniqueId: string, data?: StartWorkflowRequest): Promise<WorkflowInstance> {
      const body: Record<string, unknown> = {};
      if (data?.userUniqueId) body['user'] = { user_unique_id: data.userUniqueId };
      const dataBody: Record<string, unknown> = {};
      if (data?.source) dataBody['source'] = data.source;
      if (data?.sourceId) dataBody['source_id'] = data.sourceId;
      if (data?.sourceType) dataBody['source_type'] = data.sourceType;
      if (data?.sourceAlias) dataBody['source_alias'] = data.sourceAlias;
      if (Object.keys(dataBody).length > 0) body['data'] = dataBody;

      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/start`, body);
      return decodeOne(response, workflowInstanceMapper);
    },

    async get(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance> {
      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}`);
      return decodeOne(response, workflowInstanceMapper);
    },

    async getDetails(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstanceDetails> {
      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/details`);
      const doc = response as Record<string, unknown>;
      const instance = decodeOne(response, workflowInstanceMapper);
      // Workflow and steps metadata are included as top-level attributes in the JSON:API resource
      const attrs = (doc as any).data?.attributes || {};
      const workflow = attrs['workflow'] || {};
      const steps = attrs['steps'] || [];
      return {
        instance,
        workflow: {
          uniqueId: workflow.unique_id || instance.workflowUniqueId,
          name: workflow.name || '',
        },
        steps: Array.isArray(steps) ? steps.map((s: Record<string, unknown>) => ({
          stepUniqueId: String(s['step_unique_id'] || ''),
          stepName: String(s['step_name'] || ''),
          order: Number(s['order'] || 0),
          status: String(s['status'] || ''),
          startedAt: s['started_at'] ? new Date(s['started_at'] as string) : undefined,
          completedAt: s['completed_at'] ? new Date(s['completed_at'] as string) : undefined,
        })) : [],
      };
    },

    async step(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/step`, data ? {
        step: buildStepBody(data),
      } : {});
      return decodeOne(response, workflowInstanceMapper);
    },

    async logStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/log_step`, {
        step: buildStepBody(data),
      });
      return decodeOne(response, workflowInstanceMapper);
    },

    async executeStep(workflowUniqueId: string, instanceUniqueId: string, data?: ExecuteStepRequest): Promise<WorkflowInstance> {
      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/execute_step`, data?.placeholders ? {
        execute: { placeholders: data.placeholders },
      } : {});
      return decodeOne(response, workflowInstanceMapper);
    },

    async executeNextStep(workflowUniqueId: string, instanceUniqueId: string, data?: ExecuteNextStepRequest): Promise<WorkflowInstance> {
      const body: Record<string, unknown> = {};
      if (data?.transitionUniqueId) body['transition_unique_id'] = data.transitionUniqueId;
      if (data?.placeholders) body['placeholders'] = data.placeholders;
      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/execute_next_step`, Object.keys(body).length > 0 ? { execute_next: body } : {});
      return decodeOne(response, workflowInstanceMapper);
    },

    async suspend(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/suspend`, {});
      return decodeOne(response, workflowInstanceMapper);
    },

    async resume(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/resume`, {});
      return decodeOne(response, workflowInstanceMapper);
    },
  };
}
