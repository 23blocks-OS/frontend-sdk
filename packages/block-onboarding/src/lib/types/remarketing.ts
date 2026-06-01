export interface ListAbandonedJourneysParams {
  /** Hours since last update that qualifies a journey as eligible (default backend value). */
  elapsedHours?: number;
}

/**
 * A user-journey eligible for remarketing — returned by the read-only
 * `GET /tools/remarketing/abandoned_journeys` endpoint.
 *
 * Note on naming: the backend's `abandoned` scope actually selects
 * journeys UPDATED within the last N hours with status in
 * (new, in_progress), not journeys "abandoned for >N hours" as the
 * name suggests. Don't assume the name conveys semantics — use
 * `progress`/`abandonedAt` for the actual state signal.
 */
export interface AbandonedJourney {
  uniqueId: string;
  userUniqueId: string;
  onboardingUniqueId: string;
  onboardingName?: string;
  email?: string;
  progress?: number;
  abandonedAt?: Date;
}

export interface TriggerRemarketingRequest {
  /** Hours-since-update threshold for who gets emailed. Defaults to the backend value. */
  elapsedHours?: number;
}

export interface RemarketingRunResult {
  uniqueId: string;
  notifiedEmails: string[];
  totalNotifiedUsers: number;
  elapsedHours?: number;
  startedAt: Date;
  endedAt?: Date;
  runningTime?: string;
  updatedAt?: Date;
}

export interface RemarketingNotificationResult {
  uniqueId: string;
  userJourneyUniqueId: string;
  userUniqueId: string;
  email?: string;
  onboardingUniqueId?: string;
  onboardingName?: string;
  notifiedAt: Date;
}
