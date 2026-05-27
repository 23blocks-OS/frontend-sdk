export interface TriggerRemarketingRunRequest {
  /** Hours since last activity that qualifies a journey as abandoned. */
  elapsedHours?: number;
}

export interface RemarketingRunResult {
  uniqueId: string;
  notifiedEmails: string[];
  totalNotifiedUsers: number;
  startedAt: Date;
  endedAt?: Date;
  runningTime?: string;
  updatedAt?: Date;
}
