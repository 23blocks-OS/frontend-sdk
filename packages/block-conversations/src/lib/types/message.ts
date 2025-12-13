import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Message extends IdentityCore {
  contextId?: string;
  parentId?: string;
  content: string;

  // Source (sender)
  source?: string;
  sourceId?: string;
  sourceAlias?: string;
  sourceEmail?: string;
  sourcePhone?: string;
  sourceType?: string;

  // Target (recipient)
  target?: string;
  targetId?: string;
  targetAlias?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetType?: string;
  targetDeviceId?: string;

  // Value and data source
  value?: number;
  dataSource?: string;
  dataSourceId?: string;
  dataSourceType?: string;
  dataSourceAlias?: string;

  // Status
  status: EntityStatus;
  enabled: boolean;

  // Extra data
  payload?: Record<string, unknown>;

  // Notification
  notificationContent?: string;
  notificationUrl?: string;

  // Expiration
  expiresAt?: Date;

  // RAG sources
  ragSources?: string[];

  // Idempotency
  idempotencyKey?: string;

  // Tracking
  createdBy?: string;
  updatedBy?: string;
}

// Request types
export interface CreateMessageRequest {
  contextId?: string;
  parentId?: string;
  content: string;
  source?: string;
  sourceId?: string;
  sourceAlias?: string;
  sourceEmail?: string;
  sourcePhone?: string;
  sourceType?: string;
  target?: string;
  targetId?: string;
  targetAlias?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetType?: string;
  targetDeviceId?: string;
  value?: number;
  dataSource?: string;
  dataSourceId?: string;
  dataSourceType?: string;
  dataSourceAlias?: string;
  notificationContent?: string;
  notificationUrl?: string;
  expiresAt?: Date;
  ragSources?: string[];
  idempotencyKey?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateMessageRequest {
  content?: string;
  status?: EntityStatus;
  enabled?: boolean;
  payload?: Record<string, unknown>;
}

export interface ListMessagesParams {
  page?: number;
  perPage?: number;
  contextId?: string;
  parentId?: string;
  status?: EntityStatus;
  sourceId?: string;
  targetId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
