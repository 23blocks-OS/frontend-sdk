import type { Transport } from '@23blocks/contracts';

export interface CalendarSyncResult {
  success: boolean;
  syncedEvents: number;
  errors?: string[];
  syncedAt: Date;
}

export interface CalendarSyncService {
  syncUser(userUniqueId: string): Promise<CalendarSyncResult>;
  syncTenant(): Promise<CalendarSyncResult>;
}

export function createCalendarSyncService(transport: Transport, _config: { appId: string }): CalendarSyncService {
  return {
    async syncUser(userUniqueId: string): Promise<CalendarSyncResult> {
      const response = await transport.post<any>(`/users/${userUniqueId}/calendar/sync`, {});
      return {
        success: response.success ?? true,
        syncedEvents: response.synced_events || 0,
        errors: response.errors,
        syncedAt: new Date(response.synced_at || Date.now()),
      };
    },

    async syncTenant(): Promise<CalendarSyncResult> {
      const response = await transport.post<any>('/calendar/sync', {});
      return {
        success: response.success ?? true,
        syncedEvents: response.synced_events || 0,
        errors: response.errors,
        syncedAt: new Date(response.synced_at || Date.now()),
      };
    },
  };
}
