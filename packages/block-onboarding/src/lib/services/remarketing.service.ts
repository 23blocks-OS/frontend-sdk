import type { Transport, PageResult } from '@23blocks/contracts';
import type {
  AbandonedJourney,
  ListAbandonedJourneysParams,
} from '../types/remarketing';

export interface RemarketingService {
  listAbandonedJourneys(params?: ListAbandonedJourneysParams): Promise<PageResult<AbandonedJourney>>;
}

export function createRemarketingService(transport: Transport, _config: { appId: string }): RemarketingService {
  return {
    async listAbandonedJourneys(params?: ListAbandonedJourneysParams): Promise<PageResult<AbandonedJourney>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.onboardingUniqueId) queryParams['onboarding_unique_id'] = params.onboardingUniqueId;
      if (params?.minProgress !== undefined) queryParams['min_progress'] = String(params.minProgress);
      if (params?.maxProgress !== undefined) queryParams['max_progress'] = String(params.maxProgress);
      if (params?.abandonedAfter) queryParams['abandoned_after'] = params.abandonedAfter.toISOString();
      if (params?.abandonedBefore) queryParams['abandoned_before'] = params.abandonedBefore.toISOString();

      const response = await transport.get<any>('/tools/remarketing/abandoned_journeys', { params: queryParams });
      const data = response.data || [];
      return {
        data: data.map((j: any) => ({
          id: j.id,
          uniqueId: j.unique_id,
          userUniqueId: j.user_unique_id,
          onboardingUniqueId: j.onboarding_unique_id,
          currentStep: j.current_step,
          completedSteps: j.completed_steps || [],
          status: j.status,
          progress: j.progress || 0,
          startedAt: new Date(j.started_at),
          completedAt: j.completed_at ? new Date(j.completed_at) : undefined,
          suspendedAt: j.suspended_at ? new Date(j.suspended_at) : undefined,
          userEmail: j.user_email,
          userName: j.user_name,
          abandonedAt: new Date(j.abandoned_at || j.updated_at),
          lastStepName: j.last_step_name,
          payload: j.payload,
          createdAt: new Date(j.created_at),
          updatedAt: new Date(j.updated_at),
        })),
        meta: {
          totalCount: response.meta?.total_count || data.length,
          page: response.meta?.page || 1,
          perPage: response.meta?.per_page || data.length,
          totalPages: response.meta?.total_pages || 1,
        },
      };
    },
  };
}
