import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface MessageAction extends IdentityCore {
  actionType?: string;
  controlType?: string;
  controlLabel?: string;
  controlValue?: string;
  controlName?: string;
  controlId?: string;
  controlClass?: string;
  controlTag?: string;
  controlPlaceholder?: string;
  controlHref?: string;
  controlSrc?: string;
  controlAlt?: string;
  controlHelp?: string;
  controlSetId?: string;
  controlSetName?: string;
  controlSetClass?: string;
  messageUniqueId?: string;
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
}

export interface CreateMessageActionRequest {
  actionType?: string;
  controlType?: string;
  controlLabel?: string;
  controlValue?: string;
  controlName?: string;
  controlId?: string;
  controlClass?: string;
  controlTag?: string;
  controlPlaceholder?: string;
  controlHref?: string;
  controlSrc?: string;
  controlAlt?: string;
  controlHelp?: string;
  controlSetId?: string;
  controlSetName?: string;
  controlSetClass?: string;
  status?: EntityStatus;
  enabled?: boolean;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
}

export interface UpdateMessageActionRequest {
  status?: EntityStatus;
  enabled?: boolean;
  payload?: Record<string, unknown>;
  response?: Record<string, unknown>;
  controlValue?: string;
}

export interface ListMessageActionsParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
