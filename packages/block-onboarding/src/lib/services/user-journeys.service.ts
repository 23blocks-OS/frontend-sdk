import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  UserJourney,
  StartJourneyRequest,
  CompleteStepRequest,
  ListUserJourneysParams,
} from '../types/user-journey';
import { userJourneyMapper } from '../mappers/user-journey.mapper';

export interface UserJourneysService {
  list(params?: ListUserJourneysParams): Promise<PageResult<UserJourney>>;
  get(uniqueId: string): Promise<UserJourney>;
  start(data: StartJourneyRequest): Promise<UserJourney>;
  completeStep(uniqueId: string, data: CompleteStepRequest): Promise<UserJourney>;
  abandon(uniqueId: string): Promise<UserJourney>;
  getByUser(userUniqueId: string): Promise<UserJourney[]>;
  getProgress(uniqueId: string): Promise<{ progress: number; currentStep?: number; completedSteps?: number[] }>;
}

export function createUserJourneysService(transport: Transport, _config: { appId: string }): UserJourneysService {
  return {
    async list(params?: ListUserJourneysParams): Promise<PageResult<UserJourney>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.userUniqueId) queryParams['user_unique_id'] = params.userUniqueId;
      if (params?.onboardingUniqueId) queryParams['onboarding_unique_id'] = params.onboardingUniqueId;
      if (params?.flowUniqueId) queryParams['flow_unique_id'] = params.flowUniqueId;
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/user_journeys', { params: queryParams });
      return decodePageResult(response, userJourneyMapper);
    },

    async get(uniqueId: string): Promise<UserJourney> {
      const response = await transport.get<unknown>(`/user_journeys/${uniqueId}`);
      return decodeOne(response, userJourneyMapper);
    },

    async start(data: StartJourneyRequest): Promise<UserJourney> {
      const response = await transport.post<unknown>('/user_journeys', {
        data: {
          type: 'UserJourney',
          attributes: {
            user_unique_id: data.userUniqueId,
            onboarding_unique_id: data.onboardingUniqueId,
            flow_unique_id: data.flowUniqueId,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, userJourneyMapper);
    },

    async completeStep(uniqueId: string, data: CompleteStepRequest): Promise<UserJourney> {
      const response = await transport.post<unknown>(`/user_journeys/${uniqueId}/complete_step`, {
        data: {
          type: 'UserJourney',
          attributes: {
            step_number: data.stepNumber,
            step_data: data.stepData,
          },
        },
      });
      return decodeOne(response, userJourneyMapper);
    },

    async abandon(uniqueId: string): Promise<UserJourney> {
      const response = await transport.put<unknown>(`/user_journeys/${uniqueId}/abandon`, {
        data: {
          type: 'UserJourney',
          attributes: {},
        },
      });
      return decodeOne(response, userJourneyMapper);
    },

    async getByUser(userUniqueId: string): Promise<UserJourney[]> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/journeys`);
      return decodeMany(response, userJourneyMapper);
    },

    async getProgress(uniqueId: string): Promise<{ progress: number; currentStep?: number; completedSteps?: number[] }> {
      const response = await transport.get<unknown>(`/user_journeys/${uniqueId}/progress`);
      const data = response as { data: { attributes: { progress: number; current_step?: number; completed_steps?: number[] } } };
      return {
        progress: data.data.attributes.progress || 0,
        currentStep: data.data.attributes.current_step,
        completedSteps: data.data.attributes.completed_steps,
      };
    },
  };
}
