import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface PremiseEvent extends IdentityCore {
  premiseUniqueId: string;
  locationUniqueId?: string;
  eventType: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  allDay: boolean;
  recurrence?: string;
  organizerUniqueId?: string;
  capacity?: number;
  attendeeCount?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface CreatePremiseEventRequest {
  eventType: string;
  title: string;
  description?: string;
  startTime: string;
  endTime?: string;
  allDay?: boolean;
  recurrence?: string;
  organizerUniqueId?: string;
  capacity?: number;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdatePremiseEventRequest {
  eventType?: string;
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  allDay?: boolean;
  recurrence?: string;
  capacity?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListPremiseEventsParams {
  page?: number;
  perPage?: number;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  status?: EntityStatus;
  organizerUniqueId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
