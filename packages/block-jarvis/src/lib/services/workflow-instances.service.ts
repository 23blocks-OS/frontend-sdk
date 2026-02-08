import type { Transport } from '@23blocks/contracts';
import { decodeOne } from '@23blocks/jsonapi-codec';
import type {
  WorkflowInstance,
  WorkflowInstanceDetails,
  StartWorkflowRequest,
  StartWorkflowResponse,
  StepWorkflowRequest,
  LogWorkflowStepRequest,
} from '../types/workflow-instance.js';
import { workflowInstanceMapper } from '../mappers/workflow-instance.mapper.js';

export interface WorkflowInstancesService {
  /**
   * Start a new workflow instance.
   * @returns StartWorkflowResponse containing the created WorkflowInstance.
   */
  start(workflowUniqueId: string, data?: StartWorkflowRequest): Promise<StartWorkflowResponse>;

  /**
   * Get a single workflow instance by unique ID.
   * @returns The matching WorkflowInstance record.
   */
  get(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;

  /**
   * Get detailed information about a workflow instance including step statuses.
   * @returns WorkflowInstanceDetails with instance, workflow info, and step progress.
   */
  getDetails(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstanceDetails>;

  /**
   * Advance a workflow instance to the next step.
   * @returns The updated WorkflowInstance record.
   */
  step(workflowUniqueId: string, instanceUniqueId: string, data?: StepWorkflowRequest): Promise<WorkflowInstance>;

  /**
   * Log output or errors for a specific workflow step.
   * @returns The updated WorkflowInstance record.
   */
  logStep(workflowUniqueId: string, instanceUniqueId: string, data: LogWorkflowStepRequest): Promise<WorkflowInstance>;

  /**
   * Suspend a running workflow instance.
   * @returns The updated WorkflowInstance record with suspended status.
   */
  suspend(workflowUniqueId: string, instanceUniqueId: string): Promise<WorkflowInstance>;

  /**
   * Resume a suspended workflow instance.
   * @returns The updated WorkflowInstance record with resumed status.
   */
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
