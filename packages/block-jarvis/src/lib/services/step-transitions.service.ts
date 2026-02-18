import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  StepTransition,
  CreateStepTransitionRequest,
  UpdateStepTransitionRequest,
  ListStepTransitionsParams,
} from '../types/step-transition.js';
import { stepTransitionMapper } from '../mappers/step-transition.mapper.js';

function buildStepTransitionBody(data: CreateStepTransitionRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.transitionType) body['transition_type'] = data.transitionType;
  if (data.priority !== undefined) body['priority'] = data.priority;
  if (data.isDefault !== undefined) body['is_default'] = data.isDefault;
  if (data.allowsBackward !== undefined) body['allows_backward'] = data.allowsBackward;
  if (data.maxIterations !== undefined) body['max_iterations'] = data.maxIterations;
  if (data.onLoop) body['on_loop'] = data.onLoop;
  return body;
}

export interface StepTransitionsService {
  list(stepUniqueId: string, params?: ListStepTransitionsParams): Promise<PageResult<StepTransition>>;
  get(stepUniqueId: string, uniqueId: string): Promise<StepTransition>;
  create(stepUniqueId: string, data: CreateStepTransitionRequest): Promise<StepTransition>;
  update(stepUniqueId: string, uniqueId: string, data: UpdateStepTransitionRequest): Promise<StepTransition>;
  delete(stepUniqueId: string, uniqueId: string): Promise<void>;
}

export function createStepTransitionsService(transport: Transport, _config: { appId: string }): StepTransitionsService {
  return {
    async list(stepUniqueId: string, params?: ListStepTransitionsParams): Promise<PageResult<StepTransition>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/steps/${stepUniqueId}/transitions`, { params: queryParams });
      return decodePageResult(response, stepTransitionMapper);
    },

    async get(stepUniqueId: string, uniqueId: string): Promise<StepTransition> {
      const response = await transport.get<unknown>(`/steps/${stepUniqueId}/transitions/${uniqueId}`);
      return decodeOne(response, stepTransitionMapper);
    },

    async create(stepUniqueId: string, data: CreateStepTransitionRequest): Promise<StepTransition> {
      const response = await transport.post<unknown>(`/steps/${stepUniqueId}/transitions`, {
        step_transition: buildStepTransitionBody(data),
      });
      return decodeOne(response, stepTransitionMapper);
    },

    async update(stepUniqueId: string, uniqueId: string, data: UpdateStepTransitionRequest): Promise<StepTransition> {
      const response = await transport.put<unknown>(`/steps/${stepUniqueId}/transitions/${uniqueId}`, {
        step_transition: buildStepTransitionBody(data),
      });
      return decodeOne(response, stepTransitionMapper);
    },

    async delete(stepUniqueId: string, uniqueId: string): Promise<void> {
      await transport.delete(`/steps/${stepUniqueId}/transitions/${uniqueId}`);
    },
  };
}
