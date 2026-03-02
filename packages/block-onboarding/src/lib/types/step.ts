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
  name: string;
  description?: string;
  order?: number;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  step_url?: string;
  step_params?: Record<string, unknown>;
  content_url?: string;
  image_url?: string;
  video_url?: string;
  status?: string;
}

export interface UpdateStepRequest {
  name?: string;
  description?: string;
  order?: number;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  step_url?: string;
  step_params?: Record<string, unknown>;
  content_url?: string;
  image_url?: string;
  video_url?: string;
  status?: string;
}
