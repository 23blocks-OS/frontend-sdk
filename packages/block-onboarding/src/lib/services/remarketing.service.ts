import type { Transport } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import type {
  AbandonedJourney,
  ListAbandonedJourneysParams,
  TriggerRemarketingRequest,
  RemarketingRunResult,
  RemarketingNotificationResult,
} from '../types/remarketing.js';

export interface RemarketingService {
  /**
   * List user-journeys eligible for remarketing.
   *
   * Read-only — no side effects. The endpoint previously combined this
   * with the email-send action; as of 2026-06-01 the API was split into
   * three CQRS-clean endpoints (listAbandonedJourneys / triggerRemarketing /
   * triggerRemarketingForJourney).
   *
   * @param params - Optional elapsedHours threshold (hours since last update)
   * @returns Array of AbandonedJourney records
   */
  listAbandonedJourneys(params?: ListAbandonedJourneysParams): Promise<AbandonedJourney[]>;

  /**
   * Trigger a bulk remarketing run — enqueues emails to all journeys
   * matching the elapsedHours threshold. Mails are sent via deliver_later;
   * the response returns fast with the count enqueued (not delivered).
   *
   * @param params - Optional elapsedHours threshold
   * @returns Run summary including notifiedEmails and totalNotifiedUsers (enqueued count)
   */
  triggerRemarketing(params?: TriggerRemarketingRequest): Promise<RemarketingRunResult>;

  /**
   * Trigger a remarketing notification for a single user-journey.
   *
   * @param userJourneyUniqueId - The journey's unique id
   * @returns Notification record with the journey/user/onboarding context
   */
  triggerRemarketingForJourney(userJourneyUniqueId: string): Promise<RemarketingNotificationResult>;
}

function parseAbandonedJourney(d: any): AbandonedJourney {
  const a = d?.attributes ?? d ?? {};
  return {
    uniqueId: String(a.unique_id ?? d?.id ?? ''),
    userUniqueId: String(a.user_unique_id ?? ''),
    onboardingUniqueId: String(a.onboarding_unique_id ?? ''),
    onboardingName: a.onboarding_name as string | undefined,
    email: a.email as string | undefined,
    progress: a.progress != null ? Number(a.progress) : undefined,
    abandonedAt: a.abandoned_at ? new Date(a.abandoned_at) : undefined,
  };
}

export function createRemarketingService(transport: Transport, _config: { apiKey: string }): RemarketingService {
  return {
    async listAbandonedJourneys(params): Promise<AbandonedJourney[]> {
      const q: Record<string, string> = {};
      if (params?.elapsedHours !== undefined) q['elapsed_hours'] = String(params.elapsedHours);
      const response = await transport.get<{ data?: any[] }>('/tools/remarketing/abandoned_journeys', { params: q });
      const data = Array.isArray(response?.data) ? response.data : [];
      return data.map(parseAbandonedJourney);
    },

    async triggerRemarketing(params): Promise<RemarketingRunResult> {
      const body: Record<string, unknown> = {};
      if (params?.elapsedHours !== undefined) body['elapsed_hours'] = params.elapsedHours;
      const response = await transport.post<{
        data: {
          attributes: {
            unique_id: string;
            notified_users?: string[];
            total_notified_users?: number;
            elapsed_hours?: number;
            started_at?: string;
            ended_at?: string;
            running_time?: string;
            updated_at?: string;
          };
        };
      }>('/tools/remarketing/notifications', body);
      const a = response.data.attributes;
      return {
        uniqueId: a.unique_id,
        notifiedEmails: a.notified_users ?? [],
        totalNotifiedUsers: a.total_notified_users ?? 0,
        elapsedHours: a.elapsed_hours,
        startedAt: a.started_at ? new Date(a.started_at) : new Date(),
        endedAt: a.ended_at ? new Date(a.ended_at) : undefined,
        runningTime: a.running_time,
        updatedAt: a.updated_at ? new Date(a.updated_at) : undefined,
      };
    },

    async triggerRemarketingForJourney(userJourneyUniqueId): Promise<RemarketingNotificationResult> {
      assertUuid(userJourneyUniqueId, 'userJourneyUniqueId');
      const response = await transport.post<{
        data: {
          attributes: {
            unique_id?: string;
            user_journey_unique_id: string;
            user_unique_id: string;
            email?: string;
            onboarding_unique_id?: string;
            onboarding_name?: string;
            notified_at?: string;
          };
        };
      }>(`/tools/remarketing/notifications/${userJourneyUniqueId}`, {});
      const a = response.data.attributes;
      return {
        uniqueId: a.unique_id ?? userJourneyUniqueId,
        userJourneyUniqueId: a.user_journey_unique_id,
        userUniqueId: a.user_unique_id,
        email: a.email,
        onboardingUniqueId: a.onboarding_unique_id,
        onboardingName: a.onboarding_name,
        notifiedAt: a.notified_at ? new Date(a.notified_at) : new Date(),
      };
    },
  };
}
