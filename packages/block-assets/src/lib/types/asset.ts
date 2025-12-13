import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Asset extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  assetType?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;

  // Financial
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;

  // Location & Assignment
  locationUniqueId?: string;
  assignedToUniqueId?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // Extra data
  payload?: Record<string, unknown>;
  tags?: string[];
}

// Request types
export interface CreateAssetRequest {
  code: string;
  name: string;
  description?: string;
  assetType?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  locationUniqueId?: string;
  assignedToUniqueId?: string;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface UpdateAssetRequest {
  name?: string;
  description?: string;
  assetType?: string;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  purchaseDate?: Date;
  purchasePrice?: number;
  currentValue?: number;
  locationUniqueId?: string;
  assignedToUniqueId?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
  tags?: string[];
}

export interface ListAssetsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  assetType?: string;
  locationUniqueId?: string;
  assignedToUniqueId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TransferAssetRequest {
  locationUniqueId: string;
  notes?: string;
}

export interface AssignAssetRequest {
  assignedToUniqueId: string;
  notes?: string;
}
