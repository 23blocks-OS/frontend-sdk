import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Premise extends IdentityCore {
  addressUniqueId?: string;
  areaUniqueId?: string;
  locationUniqueId?: string;
  parentId?: string;
  premiseType?: string;
  floor?: string;
  code?: string;
  name: string;
  description?: string;
  accessInstructions?: string;
  additionalInstructions?: string;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  notes?: string;
  status: EntityStatus;
  enabled: boolean;
  qcode?: string;
  payload?: Record<string, unknown>;
  allowBookingOverlap?: boolean;
  capacity?: number;
  tags?: string[];
}

// Request types
export interface CreatePremiseRequest {
  name: string;
  code?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  locationUniqueId?: string;
  parentId?: string;
  premiseType?: string;
  floor?: string;
  description?: string;
  accessInstructions?: string;
  capacity?: number;
  allowBookingOverlap?: boolean;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdatePremiseRequest {
  name?: string;
  code?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  locationUniqueId?: string;
  premiseType?: string;
  floor?: string;
  description?: string;
  accessInstructions?: string;
  additionalInstructions?: string;
  notes?: string;
  capacity?: number;
  allowBookingOverlap?: boolean;
  enabled?: boolean;
  status?: EntityStatus;
  tags?: string[];
  payload?: Record<string, unknown>;
}

export interface ListPremisesParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  premiseType?: string;
  locationUniqueId?: string;
  addressUniqueId?: string;
  areaUniqueId?: string;
  parentId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
