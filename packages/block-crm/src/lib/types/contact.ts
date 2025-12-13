import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Contact extends IdentityCore {
  firstName: string;
  lastName: string;
  middleName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  position?: string;
  notes?: string;
  source?: string;
  sourceId?: string;
  sourceAlias?: string;
  sourceType?: string;
  status: EntityStatus;
  contactStatus?: string;
  userUniqueId?: string;
  enabled: boolean;
  tags?: string[];
}

export interface ContactProfile extends IdentityCore {
  contactUniqueId: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  position?: string;
  notes?: string;
  source?: string;
  sourceId?: string;
  sourceAlias?: string;
  sourceType?: string;
  status: EntityStatus;
  contactStatus?: string;
  userUniqueId?: string;
  enabled: boolean;
  tags?: string[];
}

// Request types
export interface CreateContactRequest {
  firstName: string;
  lastName: string;
  middleName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  position?: string;
  notes?: string;
  source?: string;
  userUniqueId?: string;
  tags?: string[];
}

export interface UpdateContactRequest {
  firstName?: string;
  lastName?: string;
  middleName?: string;
  primaryEmail?: string;
  primaryPhone?: string;
  position?: string;
  notes?: string;
  contactStatus?: string;
  enabled?: boolean;
  status?: EntityStatus;
  tags?: string[];
}

export interface ListContactsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  contactStatus?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
