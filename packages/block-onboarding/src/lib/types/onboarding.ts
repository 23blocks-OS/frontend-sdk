import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Onboarding extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  steps?: Record<string, unknown>[];
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateOnboardingRequest {
  name: string;
  description?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  total_steps?: number;
  content_url?: string;
  image_url?: string;
  video_url?: string;
}

export interface UpdateOnboardingRequest {
  name?: string;
  description?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  total_steps?: number;
  content_url?: string;
  image_url?: string;
  video_url?: string;
}

export interface StepUserRequest {
  step_unique_id?: string;
  step_params?: Record<string, unknown>;
  step_status?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  redirect_url?: string;
}

export interface ListOnboardingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  enabled?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
