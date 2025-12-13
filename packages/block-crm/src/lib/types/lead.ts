import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Lead extends IdentityCore {
  firstName: string;
  lastName: string;
  middleName?: string;
  leadEmail?: string;
  phoneNumber?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  notes?: string;
  source?: string;
  status: EntityStatus;
  contactStatus?: string;
  enabled: boolean;
  payload?: Record<string, unknown>;
  tags?: string[];
}

// Request types
export interface CreateLeadRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  leadEmail?: string;
  phoneNumber?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  notes?: string;
  source?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateLeadRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  leadEmail?: string;
  phoneNumber?: string;
  webSite?: string;
  twitter?: string;
  fb?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  blog?: string;
  notes?: string;
  contactStatus?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListLeadsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  contactStatus?: string;
  source?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
