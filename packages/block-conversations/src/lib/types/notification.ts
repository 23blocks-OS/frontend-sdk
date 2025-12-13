import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Notification extends IdentityCore {
  content: string;

  // Source
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;

  // URL
  url?: string;

  // Status
  status: EntityStatus;

  // Target
  target?: string;
  targetId?: string;
  targetAlias?: string;
  targetType?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetDeviceId?: string;

  // Multichannel
  multichannel?: boolean;

  // Extra data
  payload?: Record<string, unknown>;

  // Expiration
  expiresAt?: Date;

  // Tracking
  createdBy?: string;
  updatedBy?: string;
}

// Request types
export interface CreateNotificationRequest {
  content: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  url?: string;
  target?: string;
  targetId?: string;
  targetAlias?: string;
  targetType?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetDeviceId?: string;
  multichannel?: boolean;
  expiresAt?: Date;
  payload?: Record<string, unknown>;
}

export interface UpdateNotificationRequest {
  content?: string;
  url?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListNotificationsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  targetId?: string;
  sourceId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
