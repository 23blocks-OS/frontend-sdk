import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Meeting extends IdentityCore {
  title: string;
  description?: string;
  hostUniqueId: string;
  conversationUniqueId?: string;
  groupUniqueId?: string;
  scheduledAt?: Date;
  startedAt?: Date;
  endedAt?: Date;
  duration?: number;
  meetingType: string;
  meetingUrl?: string;
  externalMeetingId?: string;
  provider?: string;
  maxParticipants?: number;
  isRecording: boolean;
  recordingUrl?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface MeetingSession {
  sessionId: string;
  meetingUniqueId: string;
  token: string;
  joinUrl: string;
  expiresAt: Date;
}

export interface CreateMeetingRequest {
  title: string;
  description?: string;
  conversationUniqueId?: string;
  groupUniqueId?: string;
  scheduledAt?: string;
  meetingType?: string;
  maxParticipants?: number;
  isRecording?: boolean;
  provider?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMeetingRequest {
  title?: string;
  description?: string;
  scheduledAt?: string;
  maxParticipants?: number;
  isRecording?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListMeetingsParams {
  page?: number;
  perPage?: number;
  hostUniqueId?: string;
  conversationUniqueId?: string;
  groupUniqueId?: string;
  status?: EntityStatus;
  scheduledAfter?: string;
  scheduledBefore?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
