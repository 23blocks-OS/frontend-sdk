import type { OnboardJourney } from './onboard';

export interface AbandonedJourney extends OnboardJourney {
  userEmail?: string;
  userName?: string;
  abandonedAt: Date;
  lastStepName?: string;
}

export interface ListAbandonedJourneysParams {
  page?: number;
  perPage?: number;
  onboardingUniqueId?: string;
  minProgress?: number;
  maxProgress?: number;
  abandonedAfter?: Date;
  abandonedBefore?: Date;
}
