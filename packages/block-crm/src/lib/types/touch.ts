import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Touch extends IdentityCore {
  contactUniqueId?: string;
  userUniqueId?: string;
  touchType?: string;
  channel?: string;
  subject?: string;
  notes?: string;
  touchedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateTouchRequest {
  contactUniqueId?: string;
  userUniqueId?: string;
  touchType?: string;
  channel?: string;
  subject?: string;
  notes?: string;
  touchedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdateTouchRequest {
  touchType?: string;
  channel?: string;
  subject?: string;
  notes?: string;
  touchedAt?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTouchesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  contactUniqueId?: string;
  userUniqueId?: string;
  touchType?: string;
  channel?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
