import type { EntityStatus, IdentityCore } from '@23blocks/contracts';

/**
 * Availability - time slot availability for students or teachers
 */
export interface Availability extends IdentityCore {
  userUniqueId: string;
  userType: 'student' | 'teacher';
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  timezone?: string;
  isRecurring?: boolean;
  effectiveFrom?: Date;
  effectiveUntil?: Date;
  status: EntityStatus;
}

/**
 * Calendar Event - scheduled event for students or teachers
 */
export interface CalendarEvent extends IdentityCore {
  title: string;
  description?: string;
  eventType?: string;
  startAt: Date;
  endAt: Date;
  allDay?: boolean;
  location?: string;
  userUniqueId?: string;
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  recurrence?: string;
  timezone?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

/**
 * Create availability request
 */
export interface CreateAvailabilityRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  timezone?: string;
  isRecurring?: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string;
}

/**
 * Update availability request
 */
export interface UpdateAvailabilityRequest {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  isRecurring?: boolean;
  effectiveFrom?: string;
  effectiveUntil?: string;
  status?: EntityStatus;
}

/**
 * Bulk update availability slots request
 */
export interface BulkUpdateAvailabilityRequest {
  slots: CreateAvailabilityRequest[];
}

/**
 * Create event request
 */
export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  eventType?: string;
  startAt: string;
  endAt: string;
  allDay?: boolean;
  location?: string;
  userUniqueId?: string;
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  recurrence?: string;
  timezone?: string;
  payload?: Record<string, unknown>;
}

/**
 * Update event request
 */
export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  eventType?: string;
  startAt?: string;
  endAt?: string;
  allDay?: boolean;
  location?: string;
  recurrence?: string;
  timezone?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

/**
 * List events params
 */
export interface ListCalendarEventsParams {
  page?: number;
  perPage?: number;
  userUniqueId?: string;
  courseUniqueId?: string;
  courseGroupUniqueId?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
}
