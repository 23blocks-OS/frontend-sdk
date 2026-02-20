import type { Transport } from '@23blocks/contracts';
import type {
  CrmSyncResult,
  CrmSyncBatchRequest,
  CrmSyncBatchResult,
  CrmConnectionStatus,
  CrmSyncStatus,
} from '../types/crm-sync.js';

export interface CrmSyncService {
  syncLanding(uniqueId: string): Promise<CrmSyncResult>;
  syncSubscription(uniqueId: string): Promise<CrmSyncResult>;
  syncAppointment(uniqueId: string, asType?: string): Promise<CrmSyncResult>;
  batchSync(data: CrmSyncBatchRequest): Promise<CrmSyncBatchResult>;
  retryFailed(limit?: number): Promise<CrmSyncBatchResult>;
  testConnection(): Promise<CrmConnectionStatus>;
  status(): Promise<CrmSyncStatus>;
}

export function createCrmSyncService(transport: Transport, _config: { apiKey: string }): CrmSyncService {
  return {
    async syncLanding(uniqueId: string): Promise<CrmSyncResult> {
      const response = await transport.post<unknown>(`/crm/sync/landing/${uniqueId}`, {});
      return mapSyncResult(response);
    },

    async syncSubscription(uniqueId: string): Promise<CrmSyncResult> {
      const response = await transport.post<unknown>(`/crm/sync/subscription/${uniqueId}`, {});
      return mapSyncResult(response);
    },

    async syncAppointment(uniqueId: string, asType?: string): Promise<CrmSyncResult> {
      const body: Record<string, unknown> = {};
      if (asType) body['as_type'] = asType;
      const response = await transport.post<unknown>(`/crm/sync/appointment/${uniqueId}`, body);
      return mapSyncResult(response);
    },

    async batchSync(data: CrmSyncBatchRequest): Promise<CrmSyncBatchResult> {
      const response = await transport.post<unknown>('/crm/sync/batch', {
        batch: {
          limit: data.limit,
          sync_landings: data.syncLandings,
          sync_subscriptions: data.syncSubscriptions,
          sync_appointments: data.syncAppointments,
          appointments_as_type: data.appointmentsAsType,
        },
      });
      return mapBatchResult(response);
    },

    async retryFailed(limit?: number): Promise<CrmSyncBatchResult> {
      const body: Record<string, unknown> = {};
      if (limit !== undefined) body['limit'] = limit;
      const response = await transport.post<unknown>('/crm/sync/retry_failed', body);
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
