import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Quote extends IdentityCore {
  accountUniqueId?: string;
  contactUniqueId?: string;
  code: string;
  name: string;
  notes?: string;
  budget?: number;
  total?: number;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  payload?: Record<string, unknown>;
  nextActionAt?: Date;
  ownerUniqueId?: string;
  ownerName?: string;
  ownerEmail?: string;
  status: EntityStatus;
  enabled: boolean;
  tags?: string[];
}

// Request types
export interface CreateQuoteRequest {
  accountUniqueId?: string;
  contactUniqueId?: string;
  code: string;
  name: string;
  notes?: string;
  budget?: number;
  total?: number;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  payload?: Record<string, unknown>;
  nextActionAt?: Date;
  ownerUniqueId?: string;
  tags?: string[];
}

export interface UpdateQuoteRequest {
  name?: string;
  notes?: string;
  budget?: number;
  total?: number;
  duration?: number;
  durationUnit?: string;
  durationDescription?: string;
  payload?: Record<string, unknown>;
  nextActionAt?: Date;
  ownerUniqueId?: string;
  ownerName?: string;
  ownerEmail?: string;
  enabled?: boolean;
  status?: EntityStatus;
  tags?: string[];
}

export interface ListQuotesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  accountUniqueId?: string;
  contactUniqueId?: string;
  ownerUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
