import type { IdentityCore } from '@23blocks/contracts';

export type UserJourneyStatus = 'active' | 'completed' | 'abandoned';

export interface UserJourney extends IdentityCore {
  userUniqueId: string;
  onboardingUniqueId: string;
  flowUniqueId?: string;
  currentStep?: number;
  completedSteps?: number[];
  progress?: number;
  startedAt: Date;
  completedAt?: Date;
  status: UserJourneyStatus;
  payload?: Record<string, unknown>;
}

export interface StartJourneyRequest {
  userUniqueId: string;
  onboardingUniqueId: string;
  flowUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface CompleteStepRequest {
  stepNumber: number;
  stepData?: Record<string, unknown>;
}

export interface ListUserJourneysParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  onboardingUniqueId?: string;
  flowUniqueId?: string;
  status?: UserJourneyStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
