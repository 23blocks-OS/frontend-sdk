import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Onboarding,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  ListOnboardingsParams,
} from '../types/onboarding';
import type { OnboardingStep, AddStepRequest, UpdateStepRequest } from '../types/step';
import { onboardingMapper } from '../mappers/onboarding.mapper';
import { onboardingStepMapper } from '../mappers/step.mapper';

export interface OnboardingsService {
  list(params?: ListOnboardingsParams): Promise<PageResult<Onboarding>>;
  get(uniqueId: string): Promise<Onboarding>;
  create(data: CreateOnboardingRequest): Promise<Onboarding>;
  update(uniqueId: string, data: UpdateOnboardingRequest): Promise<Onboarding>;
  delete(uniqueId: string): Promise<void>;
  addStep(uniqueId: string, data: AddStepRequest): Promise<OnboardingStep>;
  updateStep(uniqueId: string, stepUniqueId: string, data: UpdateStepRequest): Promise<OnboardingStep>;
  deleteStep(uniqueId: string, stepUniqueId: string): Promise<void>;
  stepUser(uniqueId: string, userUniqueId: string, stepData?: Record<string, unknown>): Promise<Onboarding>;
}

export function createOnboardingsService(transport: Transport, _config: { appId: string }): OnboardingsService {
  return {
    async list(params?: ListOnboardingsParams): Promise<PageResult<Onboarding>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.enabled !== undefined) queryParams['enabled'] = String(params.enabled);
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/onboardings', { params: queryParams });
      return decodePageResult(response, onboardingMapper);
    },

    async get(uniqueId: string): Promise<Onboarding> {
      const response = await transport.get<unknown>(`/onboardings/${uniqueId}`);
      return decodeOne(response, onboardingMapper);
    },

    async create(data: CreateOnboardingRequest): Promise<Onboarding> {
      const response = await transport.post<unknown>('/onboardings', {
        onboarding: {
            code: data.code,
            name: data.name,
            description: data.description,
            steps: data.steps,
            payload: data.payload,
          },
      });
      return decodeOne(response, onboardingMapper);
    },

    async update(uniqueId: string, data: UpdateOnboardingRequest): Promise<Onboarding> {
      const response = await transport.put<unknown>(`/onboardings/${uniqueId}`, {
        onboarding: {
            name: data.name,
            description: data.description,
            steps: data.steps,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, onboardingMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/onboardings/${uniqueId}`);
    },

    async addStep(uniqueId: string, data: AddStepRequest): Promise<OnboardingStep> {
      const response = await transport.put<unknown>(`/onboardings/${uniqueId}/steps`, {
        step: {
          step_number: data.stepNumber,
          name: data.name,
          description: data.description,
          type: data.type,
          config: data.config,
          payload: data.payload,
        },
      });
      return decodeOne(response, onboardingStepMapper);
    },

    async updateStep(uniqueId: string, stepUniqueId: string, data: UpdateStepRequest): Promise<OnboardingStep> {
      const response = await transport.put<unknown>(`/onboardings/${uniqueId}/steps/${stepUniqueId}`, {
        step: {
          name: data.name,
          description: data.description,
          type: data.type,
          config: data.config,
          payload: data.payload,
        },
      });
      return decodeOne(response, onboardingStepMapper);
    },

    async deleteStep(uniqueId: string, stepUniqueId: string): Promise<void> {
      await transport.delete(`/onboardings/${uniqueId}/steps/${stepUniqueId}`);
    },

    async stepUser(uniqueId: string, userUniqueId: string, stepData?: Record<string, unknown>): Promise<Onboarding> {
      const response = await transport.put<unknown>(`/onboardings/${uniqueId}/users/${userUniqueId}`, {
        step_data: stepData,
      });
      return decodeOne(response, onboardingMapper);
    },
  };
}
