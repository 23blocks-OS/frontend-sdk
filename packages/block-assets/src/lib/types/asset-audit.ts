import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface AssetAudit extends IdentityCore {
  assetUniqueId: string;
  auditDate: Date;
  auditorUniqueId: string;
  condition?: string;
  location?: string;
  notes?: string;

  // Business Logic
  status: EntityStatus;
  enabled: boolean;

  // Extra data
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateAssetAuditRequest {
  assetUniqueId: string;
  auditDate: Date;
  auditorUniqueId: string;
  condition?: string;
  location?: string;
  notes?: string;
  payload?: Record<string, unknown>;
}

export interface UpdateAssetAuditRequest {
  auditDate?: Date;
  auditorUniqueId?: string;
  condition?: string;
  location?: string;
  notes?: string;
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAssetAuditsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  assetUniqueId?: string;
  auditorUniqueId?: string;
  startDate?: Date;
  endDate?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
