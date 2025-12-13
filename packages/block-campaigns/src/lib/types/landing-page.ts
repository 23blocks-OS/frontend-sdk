import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface LandingPage extends IdentityCore {
  campaignUniqueId: string;
  code: string;
  name: string;
  slug: string;
  templateUniqueId?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  status: EntityStatus;
  enabled: boolean;
  visits?: number;
  conversions?: number;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateLandingPageRequest {
  campaignUniqueId: string;
  code: string;
  name: string;
  slug: string;
  templateUniqueId?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateLandingPageRequest {
  name?: string;
  slug?: string;
  templateUniqueId?: string;
  content?: string;
  metaTitle?: string;
  metaDescription?: string;
  visits?: number;
  conversions?: number;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListLandingPagesParams {
  page?: number;
  perPage?: number;
  campaignUniqueId?: string;
  status?: EntityStatus;
  search?: string;
}
