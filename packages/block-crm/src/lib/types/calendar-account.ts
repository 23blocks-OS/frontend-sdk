import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CalendarAccount extends IdentityCore {
  userUniqueId: string;
  provider: string;
  email?: string;
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  lastSyncAt?: Date;
  syncEnabled: boolean;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateCalendarAccountRequest {
  provider: string;
  email?: string;
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  syncEnabled?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateCalendarAccountRequest {
  email?: string;
  name?: string;
  accessToken?: string;
  refreshToken?: string;
  tokenExpiresAt?: Date;
  syncEnabled?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCalendarAccountsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  provider?: string;
  syncEnabled?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SyncCalendarRequest {
  forceRefresh?: boolean;
  syncFrom?: Date;
  syncTo?: Date;
}

export interface SyncCalendarResponse {
  eventsCreated: number;
  eventsUpdated: number;
  eventsDeleted: number;
  lastSyncAt: Date;
}
