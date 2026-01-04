import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface WebNotification extends IdentityCore {
  recipientUniqueId: string;
  title: string;
  body: string;
  icon?: string;
  imageUrl?: string;
  actionUrl?: string;
  notificationType: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sentAt?: Date;
  readAt?: Date;
  clickedAt?: Date;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface CreateWebNotificationRequest {
  recipientUniqueId: string;
  title: string;
  body: string;
  icon?: string;
  imageUrl?: string;
  actionUrl?: string;
  notificationType?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface BulkWebNotificationRequest {
  recipientUniqueIds: string[];
  title: string;
  body: string;
  icon?: string;
  imageUrl?: string;
  actionUrl?: string;
  notificationType?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListWebNotificationsParams {
  page?: number;
  perPage?: number;
  recipientUniqueId?: string;
  notificationType?: string;
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  isRead?: boolean;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
