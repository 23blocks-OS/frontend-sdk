import type { IdentityCore } from '@23blocks/contracts';

export interface OnboardingStep extends IdentityCore {
  onboardingUniqueId: string;
  stepNumber: number;
  name: string;
  description?: string;
  type?: string;
  config?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface AddStepRequest {
  stepNumber?: number;
  name: string;
  description?: string;
  type?: string;
  config?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateStepRequest {
  name?: string;
  description?: string;
  type?: string;
  config?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}
