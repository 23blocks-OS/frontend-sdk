import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Flow,
  CreateFlowRequest,
  UpdateFlowRequest,
  ListFlowsParams,
} from '../types/flow';
import { flowMapper } from '../mappers/flow.mapper';

export interface FlowsService {
  list(params?: ListFlowsParams): Promise<PageResult<Flow>>;
  get(uniqueId: string): Promise<Flow>;
  create(data: CreateFlowRequest): Promise<Flow>;
  update(uniqueId: string, data: UpdateFlowRequest): Promise<Flow>;
  delete(uniqueId: string): Promise<void>;
  listByOnboarding(onboardingUniqueId: string): Promise<Flow[]>;
  getBySource(uniqueId: string, sourceUniqueId: string): Promise<Flow>;
  stepBySource(uniqueId: string, sourceUniqueId: string, stepData?: Record<string, unknown>): Promise<Flow>;
}

export function createFlowsService(transport: Transport, _config: { appId: string }): FlowsService {
  return {
    async list(params?: ListFlowsParams): Promise<PageResult<Flow>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.onboardingUniqueId) queryParams['onboarding_unique_id'] = params.onboardingUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.enabled !== undefined) queryParams['enabled'] = String(params.enabled);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/flows', { params: queryParams });
      return decodePageResult(response, flowMapper);
    },

    async get(uniqueId: string): Promise<Flow> {
      const response = await transport.get<unknown>(`/flows/${uniqueId}`);
      return decodeOne(response, flowMapper);
    },

    async create(data: CreateFlowRequest): Promise<Flow> {
      const response = await transport.post<unknown>('/flows', {
        flow: {
            onboarding_unique_id: data.onboardingUniqueId,
            code: data.code,
            name: data.name,
            description: data.description,
            steps: data.steps,
            conditions: data.conditions,
            payload: data.payload,
          },
      });
      return decodeOne(response, flowMapper);
    },

    async update(uniqueId: string, data: UpdateFlowRequest): Promise<Flow> {
      const response = await transport.put<unknown>(`/flows/${uniqueId}`, {
        flow: {
            name: data.name,
            description: data.description,
            steps: data.steps,
            conditions: data.conditions,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, flowMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/flows/${uniqueId}`);
    },

    async listByOnboarding(onboardingUniqueId: string): Promise<Flow[]> {
      const response = await transport.get<unknown>(`/onboardings/${onboardingUniqueId}/flows`);
      return decodeMany(response, flowMapper);
    },

    async getBySource(uniqueId: string, sourceUniqueId: string): Promise<Flow> {
      const response = await transport.get<unknown>(`/flows/${uniqueId}/sources/${sourceUniqueId}`);
      return decodeOne(response, flowMapper);
    },

    async stepBySource(uniqueId: string, sourceUniqueId: string, stepData?: Record<string, unknown>): Promise<Flow> {
      const response = await transport.put<unknown>(`/flows/${uniqueId}/sources/${sourceUniqueId}`, {
        step_data: stepData,
      });
      return decodeOne(response, flowMapper);
    },
  };
}
