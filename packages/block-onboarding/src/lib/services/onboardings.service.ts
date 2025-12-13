import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Onboarding,
  CreateOnboardingRequest,
  UpdateOnboardingRequest,
  ListOnboardingsParams,
} from '../types/onboarding';
import { onboardingMapper } from '../mappers/onboarding.mapper';

export interface OnboardingsService {
  list(params?: ListOnboardingsParams): Promise<PageResult<Onboarding>>;
  get(uniqueId: string): Promise<Onboarding>;
  create(data: CreateOnboardingRequest): Promise<Onboarding>;
  update(uniqueId: string, data: UpdateOnboardingRequest): Promise<Onboarding>;
  delete(uniqueId: string): Promise<void>;
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
        data: {
          type: 'Onboarding',
          attributes: {
            code: data.code,
            name: data.name,
            description: data.description,
            steps: data.steps,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, onboardingMapper);
    },

    async update(uniqueId: string, data: UpdateOnboardingRequest): Promise<Onboarding> {
      const response = await transport.put<unknown>(`/onboardings/${uniqueId}`, {
        data: {
          type: 'Onboarding',
          attributes: {
            name: data.name,
            description: data.description,
            steps: data.steps,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, onboardingMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/onboardings/${uniqueId}`);
    },
  };
}
