import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface PublicForm extends IdentityCore {
  formUniqueId: string;
  title?: string;
  description?: string;
  schema: Record<string, unknown>;
  uiSchema?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface PublicFormSubmission {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface PublicFormDraft {
  data: Record<string, unknown>;
  payload?: Record<string, unknown>;
}

export interface PublicFormResponse extends IdentityCore {
  formUniqueId: string;
  data: Record<string, unknown>;
  status: EntityStatus;
  submittedAt?: Date;
  payload?: Record<string, unknown>;
}
