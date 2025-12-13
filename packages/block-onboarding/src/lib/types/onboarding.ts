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
  code: string;
  name: string;
  description?: string;
  steps?: Record<string, unknown>[];
  payload?: Record<string, unknown>;
}

export interface UpdateOnboardingRequest {
  name?: string;
  description?: string;
  steps?: Record<string, unknown>[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
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
