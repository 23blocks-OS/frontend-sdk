import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MeetingParticipant extends IdentityCore {
  meetingUniqueId: string;
  contactUniqueId?: string;
  userUniqueId?: string;
  email?: string;
  name?: string;
  role?: string;
  rsvpStatus?: string;
  joinedAt?: Date;
  leftAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateMeetingParticipantRequest {
  contactUniqueId?: string;
  userUniqueId?: string;
  email?: string;
  name?: string;
  role?: string;
  rsvpStatus?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMeetingParticipantRequest {
  role?: string;
  rsvpStatus?: string;
  joinedAt?: Date;
  leftAt?: Date;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMeetingParticipantsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  role?: string;
  rsvpStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
