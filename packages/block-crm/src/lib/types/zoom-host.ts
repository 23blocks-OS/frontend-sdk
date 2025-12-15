import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ZoomHost extends IdentityCore {
  userUniqueId?: string;
  zoomUserId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  hostKey?: string;
  licenseType?: string;
  maxMeetings?: number;
  currentMeetings?: number;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

export interface ZoomHostAvailability {
  hostUniqueId: string;
  available: boolean;
  currentMeetings: number;
  maxMeetings: number;
  nextAvailableAt?: Date;
  availableSlots?: Array<{
    startTime: Date;
    endTime: Date;
  }>;
}

export interface ZoomHostAllocation {
  hostUniqueId: string;
  meetingUniqueId: string;
  zoomMeetingId?: string;
  allocatedAt: Date;
  releasedAt?: Date;
  status: string;
}

export interface AvailableUser {
  userUniqueId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

// Request types
export interface CreateZoomHostRequest {
  userUniqueId?: string;
  zoomUserId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  hostKey?: string;
  licenseType?: string;
  maxMeetings?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateZoomHostRequest {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  hostKey?: string;
  licenseType?: string;
  maxMeetings?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListZoomHostsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  licenseType?: string;
  available?: boolean;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
