import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Subscription extends IdentityCore {
  formUniqueId: string;
  userUniqueId?: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status: EntityStatus;
  subscribedAt?: Date;
  unsubscribedAt?: Date;
  payload?: Record<string, unknown>;
}

export interface CreateSubscriptionRequest {
  formUniqueId?: string;
  email: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
}

export interface UpdateSubscriptionRequest {
  email?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  phoneNumber?: string;
  notes?: string;
  selectedOption?: string;
  formFields?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  visitorUniqueId?: string;
  visitorType?: string;
  touchId?: string;
  touchReferenceId?: string;
  status?: EntityStatus;
}

export interface ListSubscriptionsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
