import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Meeting extends IdentityCore {
  code: string;
  title: string;
  meetingType?: string;
  token?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  timeUnit?: string;
  timeQuantity?: number;
  allDay?: boolean;
  timezone?: string;
  userUniqueId?: string;
  userName?: string;
  userEmail?: string;
  accountUniqueId?: string;
  meetingLocation?: string;
  meetingUrl?: string;
  meetingScore?: number;
  payload?: Record<string, unknown>;
  status: EntityStatus;
  enabled: boolean;
}

// Request types
export interface CreateMeetingRequest {
  code: string;
  title: string;
  meetingType?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  timeUnit?: string;
  timeQuantity?: number;
  allDay?: boolean;
  timezone?: string;
  userUniqueId?: string;
  accountUniqueId?: string;
  meetingLocation?: string;
  meetingUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMeetingRequest {
  title?: string;
  meetingType?: string;
  description?: string;
  scheduledAt?: Date;
  startTime?: Date;
  endTime?: Date;
  timeUnit?: string;
  timeQuantity?: number;
  allDay?: boolean;
  timezone?: string;
  meetingLocation?: string;
  meetingUrl?: string;
  meetingScore?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMeetingsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  userUniqueId?: string;
  accountUniqueId?: string;
  meetingType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
