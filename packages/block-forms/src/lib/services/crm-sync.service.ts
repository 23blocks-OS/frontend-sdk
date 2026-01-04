import type { Transport } from '@23blocks/contracts';
import type {
  CrmSyncResult,
  CrmSyncBatchRequest,
  CrmSyncBatchResult,
  CrmConnectionStatus,
  CrmSyncStatus,
} from '../types/crm-sync';

export interface CrmSyncService {
  /**
   * Sync a landing record to CRM
   */
  syncLanding(uniqueId: string): Promise<CrmSyncResult>;

  /**
   * Sync a subscription record to CRM
   */
  syncSubscription(uniqueId: string): Promise<CrmSyncResult>;

  /**
   * Sync an appointment record to CRM
   */
  syncAppointment(uniqueId: string): Promise<CrmSyncResult>;

  /**
   * Batch sync multiple records to CRM
   */
  batchSync(data: CrmSyncBatchRequest): Promise<CrmSyncBatchResult>;

  /**
   * Retry failed sync operations
   */
  retryFailed(): Promise<CrmSyncBatchResult>;

  /**
   * Test CRM connection
   */
  testConnection(): Promise<CrmConnectionStatus>;

  /**
   * Get CRM sync status
   */
  status(): Promise<CrmSyncStatus>;
}

export function createCrmSyncService(transport: Transport, _config: { appId: string }): CrmSyncService {
  return {
    async syncLanding(uniqueId: string): Promise<CrmSyncResult> {
      const response = await transport.post<unknown>(`/crm/sync/landing/${uniqueId}`, {});
      return mapSyncResult(response);
    },

    async syncSubscription(uniqueId: string): Promise<CrmSyncResult> {
      const response = await transport.post<unknown>(`/crm/sync/subscription/${uniqueId}`, {});
      return mapSyncResult(response);
    },

    async syncAppointment(uniqueId: string): Promise<CrmSyncResult> {
      const response = await transport.post<unknown>(`/crm/sync/appointment/${uniqueId}`, {});
      return mapSyncResult(response);
    },

    async batchSync(data: CrmSyncBatchRequest): Promise<CrmSyncBatchResult> {
      const response = await transport.post<unknown>('/crm/sync/batch', {
        record_type: data.recordType,
        unique_ids: data.uniqueIds,
      });
      return mapBatchResult(response);
    },

    async retryFailed(): Promise<CrmSyncBatchResult> {
      const response = await transport.post<unknown>('/crm/sync/retry_failed', {});
      return mapBatchResult(response);
    },

    async testConnection(): Promise<CrmConnectionStatus> {
      const response = await transport.get<unknown>('/crm/test_connection');
      const data = response as Record<string, unknown>;
      return {
        connected: data.connected as boolean ?? false,
        provider: data.provider as string,
        lastSyncAt: data.last_sync_at as string,
        errors: data.errors as string[],
      };
    },

    async status(): Promise<CrmSyncStatus> {
      const response = await transport.get<unknown>('/crm/status');
      const data = response as Record<string, unknown>;
      return {
        pendingCount: data.pending_count as number ?? 0,
        failedCount: data.failed_count as number ?? 0,
        lastSyncAt: data.last_sync_at as string,
        nextSyncAt: data.next_sync_at as string,
      };
    },
  };
}

function mapSyncResult(response: unknown): CrmSyncResult {
  const data = response as Record<string, unknown>;
  return {
    success: data.success as boolean ?? false,
    syncedAt: data.synced_at as string ?? new Date().toISOString(),
    crmRecordId: data.crm_record_id as string,
    errors: data.errors as string[],
  };
}

function mapBatchResult(response: unknown): CrmSyncBatchResult {
  const data = response as Record<string, unknown>;
  const results = (data.results as Array<Record<string, unknown>>) || [];
  return {
    total: data.total as number ?? 0,
    synced: data.synced as number ?? 0,
    failed: data.failed as number ?? 0,
    results: results.map((r) => ({
      uniqueId: r.unique_id as string,
      success: r.success as boolean ?? false,
      crmRecordId: r.crm_record_id as string,
      error: r.error as string,
    })),
  };
}
