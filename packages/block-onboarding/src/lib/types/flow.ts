import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Flow extends IdentityCore {
  onboardingUniqueId: string;
  code: string;
  name: string;
  description?: string;
  steps?: Record<string, unknown>[];
  conditions?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface CreateFlowRequest {
  onboardingUniqueId: string;
  code: string;
  name: string;
  description?: string;
  steps?: Record<string, unknown>[];
  conditions?: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface UpdateFlowRequest {
  name?: string;
  description?: string;
  steps?: Record<string, unknown>[];
  conditions?: Record<string, unknown>;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface StepBySourceRequest {
  step_unique_id?: string;
  step_params?: Record<string, unknown>;
  step_status?: string;
  source?: string;
  source_id?: string;
  source_type?: string;
  source_alias?: string;
  redirect_url?: string;
}

export interface ListFlowsParams {
  page?: number;
  perPage?: number;
  onboardingUniqueId?: string;
  status?: EntityStatus;
  enabled?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
