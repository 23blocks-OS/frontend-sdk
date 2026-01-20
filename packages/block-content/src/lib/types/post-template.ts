import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type TemplateFieldType = 'object' | 'array' | 'string' | 'number' | 'boolean';

export interface TemplateField {
  key: string;
  label: string;
  type: TemplateFieldType;
  required: boolean;
  description?: string;
  children?: TemplateField[];
}

export interface PostTemplate extends IdentityCore {
  uniqueId: string;
  name: string;
  slug?: string;
  description?: string;
  status: EntityStatus;
  enabled: boolean;
  fields: TemplateField[];
  payload?: Record<string, unknown>;
}

// Request types
export interface CreatePostTemplateRequest {
  name: string;
  slug?: string;
  description?: string;
  fields: TemplateField[];
  payload?: Record<string, unknown>;
}

export interface UpdatePostTemplateRequest {
  name?: string;
  slug?: string;
  description?: string;
  fields?: TemplateField[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListPostTemplatesParams {
  page?: number;
  perPage?: number;
  search?: string;
}

// Validation result types
export interface ValidationIssue {
  key: string;
  label?: string;
  message?: string;
}

export interface PostValidationResult {
  valid: boolean;
  missingRequired: ValidationIssue[];
  missingOptional: ValidationIssue[];
  warnings: ValidationIssue[];
}
