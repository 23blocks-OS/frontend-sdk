import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ContactEvent extends IdentityCore {
  contactUniqueId?: string;
  userUniqueId?: string;
  eventType?: string;
  title?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateContactEventRequest {
  contactUniqueId?: string;
  userUniqueId?: string;
  eventType?: string;
  title?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdateContactEventRequest {
  eventType?: string;
  title?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListContactEventsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  eventType?: string;
  contactUniqueId?: string;
  userUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ConfirmationRequest {
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface CheckinRequest {
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface CheckoutRequest {
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface EventNotesRequest {
  notes: string;
  payload?: Record<string, unknown>;
}
