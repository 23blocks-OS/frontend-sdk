import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ApplicationForm extends IdentityCore {
  formUniqueId: string;
  title?: string;
  description?: string;
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ApplicationFormSubmission {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ApplicationFormDraft {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface ApplicationFormResponse extends IdentityCore {
  formUniqueId: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}
