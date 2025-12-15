import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface CampaignTemplate extends IdentityCore {
  name: string;
  description?: string;
  templateType?: string;
  category?: string;
  content?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateCampaignTemplateRequest {
  name: string;
  description?: string;
  templateType?: string;
  category?: string;
  content?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  payload?: Record<string, unknown>;
}

export interface UpdateCampaignTemplateRequest {
  name?: string;
  description?: string;
  templateType?: string;
  category?: string;
  content?: string;
  thumbnailUrl?: string;
  isPublic?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListCampaignTemplatesParams {
  page?: number;
  perPage?: number;
  templateType?: string;
  category?: string;
  isPublic?: boolean;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TemplateDetail extends IdentityCore {
  templateUniqueId: string;
  name: string;
  fieldType?: string;
  defaultValue?: string;
  isRequired?: boolean;
  sortOrder?: number;
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface CreateTemplateDetailRequest {
  templateUniqueId: string;
  name: string;
  fieldType?: string;
  defaultValue?: string;
  isRequired?: boolean;
  sortOrder?: number;
  payload?: Record<string, unknown>;
}

export interface UpdateTemplateDetailRequest {
  name?: string;
  fieldType?: string;
  defaultValue?: string;
  isRequired?: boolean;
  sortOrder?: number;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListTemplateDetailsParams {
  page?: number;
  perPage?: number;
  templateUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
