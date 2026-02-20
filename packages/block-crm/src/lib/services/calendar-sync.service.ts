import type { Transport } from '@23blocks/contracts';

export interface CalendarSyncResult {
  success: boolean;
  syncedEvents: number;
  errors?: string[];
  syncedAt: Date;
}

export interface CalendarSyncService {
  /**
   * Trigger a calendar sync for a specific user.
   * @param userUniqueId - The unique identifier of the user whose calendar to sync.
   * @returns A CalendarSyncResult indicating success status, number of synced events, any errors, and sync timestamp.
   */
  syncUser(userUniqueId: string): Promise<CalendarSyncResult>;

  /**
   * Trigger a calendar sync for the entire tenant.
   * @returns A CalendarSyncResult indicating success status, number of synced events, any errors, and sync timestamp.
   */
  syncTenant(): Promise<CalendarSyncResult>;
}

export function createCalendarSyncService(transport: Transport, _config: { apiKey: string }): CalendarSyncService {
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
