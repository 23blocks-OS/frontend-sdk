export interface CrmSyncResult {
  success: boolean;
  syncedAt: string;
  crmRecordId?: string;
  errors?: string[];
}

export interface CrmSyncBatchRequest {
  /** Type of records to sync */
  recordType: 'landing' | 'subscription' | 'appointment';
  /** Record unique IDs to sync */
  uniqueIds: string[];
}

export interface CrmSyncBatchResult {
  total: number;
  synced: number;
  failed: number;
  results: Array<{
    uniqueId: string;
    success: boolean;
    crmRecordId?: string;
    error?: string;
  }>;
}

export interface CrmConnectionStatus {
  connected: boolean;
  provider?: string;
  lastSyncAt?: string;
  errors?: string[];
}

export interface CrmSyncStatus {
  pendingCount: number;
  failedCount: number;
  lastSyncAt?: string;
  nextSyncAt?: string;
}
