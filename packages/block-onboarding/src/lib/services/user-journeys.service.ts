import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  UserJourney,
  StartJourneyRequest,
  CompleteStepRequest,
  ListUserJourneysParams,
} from '../types/user-journey';
import type {
  UserJourneyReportParams,
  UserJourneyReportSummary,
  UserJourneyReportList,
} from '../types/report';
import { userJourneyMapper } from '../mappers/user-journey.mapper';

export interface UserJourneysService {
  list(params?: ListUserJourneysParams): Promise<PageResult<UserJourney>>;
  get(uniqueId: string): Promise<UserJourney>;
  start(data: StartJourneyRequest): Promise<UserJourney>;
  completeStep(uniqueId: string, data: CompleteStepRequest): Promise<UserJourney>;
  abandon(uniqueId: string): Promise<UserJourney>;
  getByUser(userUniqueId: string): Promise<UserJourney[]>;
  getProgress(uniqueId: string): Promise<{ progress: number; currentStep?: number; completedSteps?: number[] }>;
  listByUserAndOnboarding(userUniqueId: string, onboardingUniqueId: string): Promise<UserJourney>;
  reportList(params: UserJourneyReportParams): Promise<UserJourneyReportList>;
  reportSummary(params: UserJourneyReportParams): Promise<UserJourneyReportSummary>;
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
        user_journey: {
            user_unique_id: data.userUniqueId,
            onboarding_unique_id: data.onboardingUniqueId,
            flow_unique_id: data.flowUniqueId,
            payload: data.payload,
          },
      });
      return decodeOne(response, userJourneyMapper);
    },

    async completeStep(uniqueId: string, data: CompleteStepRequest): Promise<UserJourney> {
      const response = await transport.post<unknown>(`/user_journeys/${uniqueId}/complete_step`, {
        user_journey: {
            step_number: data.stepNumber,
            step_data: data.stepData,
          },
      });
      return decodeOne(response, userJourneyMapper);
    },

    async abandon(uniqueId: string): Promise<UserJourney> {
      const response = await transport.put<unknown>(`/user_journeys/${uniqueId}/abandon`, {
        user_journey: {},
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

    async listByUserAndOnboarding(userUniqueId: string, onboardingUniqueId: string): Promise<UserJourney> {
      const response = await transport.get<unknown>(`/users/${userUniqueId}/onboardings/${onboardingUniqueId}`);
      return decodeOne(response, userJourneyMapper);
    },

    async reportList(params: UserJourneyReportParams): Promise<UserJourneyReportList> {
      const response = await transport.post<any>('/reports/user_journeys/list', {
        start_date: params.startDate,
        end_date: params.endDate,
        onboarding_unique_id: params.onboardingUniqueId,
        status: params.status,
        page: params.page,
        per_page: params.perPage,
      });
      return {
        journeys: (response.journeys || []).map((j: any) => ({
          uniqueId: j.unique_id,
          userUniqueId: j.user_unique_id,
          onboardingName: j.onboarding_name,
          progress: j.progress,
          status: j.status,
          startedAt: new Date(j.started_at),
          completedAt: j.completed_at ? new Date(j.completed_at) : undefined,
        })),
        summary: {
          totalJourneys: response.summary.total_journeys,
          totalCompleted: response.summary.total_completed,
          totalAbandoned: response.summary.total_abandoned,
          totalActive: response.summary.total_active,
          averageProgress: response.summary.average_progress,
          completionRate: response.summary.completion_rate,
          journeysByStatus: response.summary.journeys_by_status,
          period: {
            startDate: new Date(response.summary.period.start_date),
            endDate: new Date(response.summary.period.end_date),
          },
        },
        meta: {
          totalCount: response.meta.total_count,
          page: response.meta.page,
          perPage: response.meta.per_page,
          totalPages: response.meta.total_pages,
        },
      };
    },

    async reportSummary(params: UserJourneyReportParams): Promise<UserJourneyReportSummary> {
      const response = await transport.post<any>('/reports/user_journeys/summary', {
        start_date: params.startDate,
        end_date: params.endDate,
        onboarding_unique_id: params.onboardingUniqueId,
        status: params.status,
      });
      return {
        totalJourneys: response.total_journeys,
        totalCompleted: response.total_completed,
        totalAbandoned: response.total_abandoned,
        totalActive: response.total_active,
        averageProgress: response.average_progress,
        completionRate: response.completion_rate,
        journeysByStatus: response.journeys_by_status,
        period: {
          startDate: new Date(response.period.start_date),
          endDate: new Date(response.period.end_date),
        },
      };
    },
  };
}
