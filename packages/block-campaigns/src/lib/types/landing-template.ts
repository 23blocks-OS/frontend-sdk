import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LandingTemplate extends IdentityCore {
  name: string;
  description?: string;
  templateType?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  thumbnailUrl?: string;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateLandingTemplateRequest {
  name: string;
  description?: string;
  templateType?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  thumbnailUrl?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateLandingTemplateRequest {
  name?: string;
  description?: string;
  templateType?: string;
  htmlContent?: string;
  cssContent?: string;
  jsContent?: string;
  thumbnailUrl?: string;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLandingTemplatesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  templateType?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
