import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  WorkflowInstance,
  WorkflowInstanceDetails,
  StartWorkflowRequest,
  StartWorkflowResponse,
  StepWorkflowRequest,
  LogWorkflowStepRequest,
} from '../types/workflow-instance';
import { workflowInstanceMapper } from '../mappers/workflow-instance.mapper';

export interface WorkflowInstancesService {
  start(workflowUniqueId: string, data?: StartWorkflowRequest): Promise<StartWorkflowResponse>;
  get(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
  getDetails(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstanceDetails>;
  step(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Promise<WorkflowInstance>;
  logStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Promise<WorkflowInstance>;
  suspend(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
  resume(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;
}

export function createWorkflowInstancesService(transport: Transport, _config: { appId: string }): WorkflowInstancesService {
  return {
    async start(workflowUniqueId: string, data?: StartWorkflowRequest): Promise<StartWorkflowResponse> {
      const response = await transport.post<unknown>(`/workflows/${workflowUniqueId}/start`, {
        input: data?.input,
        payload: data?.payload,
      });
      return {
        instance: decodeOne(response, workflowInstanceMapper),
      };
    },

    async get(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance> {
      const response = await transport.get<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}`);
      return decodeOne(response, workflowInstanceMapper);
    },

    async getDetails(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstanceDetails> {
      const response = await transport.get<any>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/details`);
      return {
        instance: decodeOne(response.instance || response, workflowInstanceMapper),
        workflow: {
          uniqueId: response.workflow?.unique_id,
          name: response.workflow?.name,
        },
        steps: (response.steps || []).map((s: any) => ({
          stepUniqueId: s.step_unique_id,
          stepName: s.step_name,
          order: s.order,
          status: s.status,
          startedAt: s.started_at ? new Date(s.started_at) : undefined,
          completedAt: s.completed_at ? new Date(s.completed_at) : undefined,
        })),
      };
    },

    async step(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}`, {
        input: data?.input,
        payload: data?.payload,
      });
      return decodeOne(response, workflowInstanceMapper);
    },

    async logStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Promise<WorkflowInstance> {
      const response = await transport.put<unknown>(`/workflows/${workflowUniqueId}/instances/${instanceUniqueId}/log`, {
        step_unique_id: data.stepUniqueId,
        status: data.status,
        output: data.output,
        error: data.error,
        payload: data.payload,
      });
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
