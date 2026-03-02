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
  contactId?: string;
  notes?: string;
  sourceId?: string;
}

export interface UpdateTouchRequest {
  contactId?: string;
  notes?: string;
  sourceId?: string;
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
