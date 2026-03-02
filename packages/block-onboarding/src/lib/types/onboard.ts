import type { IdentityCore } from '@23blocks/contracts';

export interface OnboardJourney extends IdentityCore {
  userUniqueId: string;
  onboardingUniqueId: string;
  currentStep?: number;
  completedSteps: number[];
  status: 'active' | 'completed' | 'suspended' | 'abandoned';
  progress: number;
  startedAt: Date;
  completedAt?: Date;
  suspendedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface OnboardJourneyDetails extends OnboardJourney {
  onboardingName?: string;
  steps: OnboardStepDetail[];
  logs: OnboardLogEntry[];
}

export interface OnboardStepDetail {
  stepNumber: number;
  stepName?: string;
  completed: boolean;
  completedAt?: Date;
  data?: Record<string, unknown>;
}

export interface OnboardLogEntry {
  uniqueId: string;
  action: string;
  stepNumber?: number;
  message?: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
}

export interface StartOnboardRequest {
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
}

export interface StepOnboardRequest {
  step_unique_id: string;
  step_params?: Record<string, unknown>;
  step_status?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  redirect_url?: string;
}

export interface LogOnboardRequest {
  step_unique_id?: string;
  step_params?: Record<string, unknown>;
  step_status?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  redirect_url?: string;
}
