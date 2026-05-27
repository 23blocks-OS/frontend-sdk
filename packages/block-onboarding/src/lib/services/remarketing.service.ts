import type { Transport } from '@23blocks/contracts';
import type {
  TriggerRemarketingRunRequest,
  RemarketingRunResult,
} from '../types/remarketing.js';

export interface RemarketingService {
  /**
   * Trigger a remarketing run for abandoned onboarding journeys.
   *
   * Despite the GET verb, this endpoint has side effects: it identifies
   * journeys whose last activity is older than `elapsedHours` and sends a
   * remarketing email to each. Returns a summary of who was notified.
   *
   * @param params - Optional elapsedHours threshold (defaults to backend value)
   * @returns Run summary with notified emails and timing info
   */
  triggerRun(params?: TriggerRemarketingRunRequest): Promise<RemarketingRunResult>;
}

export function createRemarketingService(transport: Transport, _config: { apiKey: string }): RemarketingService {
  return {
    async triggerRun(params?: TriggerRemarketingRunRequest): Promise<RemarketingRunResult> {
      const queryParams: Record<string, string> = {};
      if (params?.elapsedHours !== undefined) queryParams['elapsed_hours'] = String(params.elapsedHours);

      const response = await transport.get<{
        data: {
          attributes: {
            unique_id: string;
            notified_users?: string[];
            total_notified_users?: number;
            started_at?: string;
            ended_at?: string;
            running_time?: string;
            updated_at?: string;
          };
        };
      }>('/tools/remarketing/abandoned_journeys', { params: queryParams });

      const a = response.data.attributes;
      return {
        uniqueId: a.unique_id,
        notifiedEmails: a.notified_users ?? [],
        totalNotifiedUsers: a.total_notified_users ?? 0,
        startedAt: a.started_at ? new Date(a.started_at) : new Date(),
        endedAt: a.ended_at ? new Date(a.ended_at) : undefined,
        runningTime: a.running_time,
        updatedAt: a.updated_at ? new Date(a.updated_at) : undefined,
      };
    },
  };
}
