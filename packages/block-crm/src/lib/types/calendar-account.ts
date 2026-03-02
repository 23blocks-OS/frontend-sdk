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
  userEmail?: string;
  code?: string;
  redirectUri?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  tokenType?: string;
  scopes?: string;
  externalUserId?: string;
  providerData?: Record<string, unknown>;
}

export interface UpdateCalendarAccountRequest {
  syncEnabled?: boolean;
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
