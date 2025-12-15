import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ZoomMeeting extends IdentityCore {
  meetingUniqueId: string;
  userUniqueId: string;
  zoomMeetingId?: string;
  zoomHostId?: string;
  joinUrl?: string;
  startUrl?: string;
  password?: string;
  topic?: string;
  agenda?: string;
  startTime?: Date;
  duration?: number;
  timezone?: string;
  zoomStatus?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface ZoomAvailability {
  available: boolean;
  nextAvailableAt?: Date;
  reason?: string;
}

// Request types
export interface ProvisionZoomMeetingRequest {
  topic?: string;
  agenda?: string;
  duration?: number;
  timezone?: string;
  password?: string;
  waitingRoom?: boolean;
  joinBeforeHost?: boolean;
  muteOnEntry?: boolean;
  autoRecording?: 'none' | 'local' | 'cloud';
  payload?: Record<string, unknown>;
}

export interface UpdateZoomMeetingRequest {
  topic?: string;
  agenda?: string;
  startTime?: Date;
  duration?: number;
  timezone?: string;
  password?: string;
  waitingRoom?: boolean;
  joinBeforeHost?: boolean;
  muteOnEntry?: boolean;
  autoRecording?: 'none' | 'local' | 'cloud';
  payload?: Record<string, unknown>;
}
