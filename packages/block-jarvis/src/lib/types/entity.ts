export interface Entity {
  id: string;
  uniqueId: string;
  code?: string;
  entityType?: string;
  entityAlias?: string;
  entitySource?: string;
  entityUrl?: string;
  content?: string;
  instructions?: string;
  stripeId?: string;
  status: string;
  timeZone?: string;
  createdBy?: string;
  updatedBy?: string;
  preferredLanguage?: string;
  entityAvatarUrl?: string;
  enabled?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/** Matches entity_params in entities_controller.rb */
export interface RegisterEntityRequest {
  code?: string;
  entityType?: string;
  entityAlias?: string;
  entitySource?: string;
  entityUrl?: string;
  content?: string;
  instructions?: string;
  stripeId?: string;
  status?: string;
  timeZone?: string;
  createdBy?: string;
  updatedBy?: string;
  preferredLanguage?: string;
  entityAvatarUrl?: string;
}

export type UpdateEntityRequest = RegisterEntityRequest;

export interface ListEntitiesParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Shared context_params across entities/users/clusters controllers */
export interface CreateContextRequest {
  uniqueId?: string;
  name?: string;
  reference?: string;
  source?: string;
  sourceId?: string;
  sourceAlias?: string;
  sourceType?: string;
  members?: string;
}

/** Shared message_params across entities/users/clusters controllers */
export interface SendMessageRequest {
  role?: string;
  content: string;
  fileIds?: string[];
  metadata?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  sourceEmail?: string;
  sourcePhone?: string;
  target?: string;
  targetAlias?: string;
  targetId?: string;
  targetType?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetDeviceId?: string;
  parentId?: string;
  value?: string;
  dataSource?: string;
  dataSourceAlias?: string;
  dataSourceId?: string;
  dataSourceType?: string;
  contextId?: string;
  notificationContent?: string;
  notificationUrl?: string;
  additionalData?: string;
}
