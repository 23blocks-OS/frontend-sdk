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
  employeeUniqueId?: string;
  scheduledAt?: Date;
  sessionLocation?: string;
  sessionUrl?: string;
  recurrence?: string;
  occurrences?: number;
}

export interface UpdateContactEventRequest {
  contactUniqueId?: string;
  employeeUniqueId?: string;
  scheduledAt?: Date;
  sessionLocation?: string;
  sessionUrl?: string;
  recurrence?: string;
  occurrences?: number;
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
}

export interface CheckinRequest {
  notes?: string;
}

export interface CheckoutRequest {
  employeeNotes?: string;
  contactNotes?: string;
  contactApproved?: boolean;
  eventFinalScore?: number;
}

export interface EventNotesRequest {
  contactNotes?: string;
  adminNotes?: string;
}
