import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export type AssetEventType =
  | 'maintenance'
  | 'transfer'
  | 'inspection'
  | 'repair'
  | 'calibration'
  | 'cleaning'
  | 'upgrade'
  | 'other';

export interface AssetEvent extends IdentityCore {
  assetUniqueId: string;
  eventType: AssetEventType;
  eventDate: Date;
  description?: string;
  performedByUniqueId?: string;
  cost?: number;
  notes?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // Extra data
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateAssetEventRequest {
  assetUniqueId: string;
  eventType: AssetEventType;
  eventDate: Date;
  description?: string;
  performedByUniqueId?: string;
  cost?: number;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAssetEventRequest {
  eventType?: AssetEventType;
  eventDate?: Date;
  description?: string;
  performedByUniqueId?: string;
  cost?: number;
  notes?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAssetEventsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  eventType?: AssetEventType;
  assetUniqueId?: string;
  performedByUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
