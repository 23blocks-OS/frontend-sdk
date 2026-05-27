import type { Transport } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import type {
  UserAvailability,
  SetAvailabilityRequest,
} from '../types/availability.js';

export interface AvailabilitiesService {
  /**
   * Get the availability status of a user
   * @param userUniqueId - Unique ID of the user to check
   * @returns UserAvailability with status, last seen timestamp, and optional custom status
   */
  get(userUniqueId: string): Promise<UserAvailability>;

  /**
   * Set the current user's status to online
   * @param data - Optional availability settings including custom status and payload
   * @returns Updated UserAvailability reflecting the online state
   * @note Defaults to status "online" if no specific status is provided in the request
   */
  goOnline(data?: SetAvailabilityRequest): Promise<UserAvailability>;

  /**
   * Set the current user's status to offline
   * @returns void on successful status change
   */
  goOffline(): Promise<void>;
}

export function createAvailabilitiesService(transport: Transport, _config: { apiKey: string }): AvailabilitiesService {
  return {
    async get(userUniqueId: string): Promise<UserAvailability> {
      assertUuid(userUniqueId, 'userUniqueId');
      const response = await transport.get<{ data: any }>(`/users/${userUniqueId}/status`);
      const attrs = response.data?.attributes || response.data || {};

      return {
        userUniqueId,
        status: attrs.status || 'offline',
        lastSeenAt: attrs.last_seen_at ? new Date(attrs.last_seen_at) : undefined,
        customStatus: attrs.custom_status,
        payload: attrs.payload,
      };
    },

    async goOnline(data?: SetAvailabilityRequest): Promise<UserAvailability> {
      const response = await transport.post<{ data: any }>('/users/status', {
        availability: {
          status: data?.status || 'online',
          custom_status: data?.customStatus,
          payload: data?.payload,
        },
      });

      const attrs = response.data?.attributes || response.data || {};

      return {
        userUniqueId: attrs.user_unique_id,
        status: attrs.status || 'online',
        lastSeenAt: attrs.last_seen_at ? new Date(attrs.last_seen_at) : undefined,
        customStatus: attrs.custom_status,
        payload: attrs.payload,
      };
    },

    async goOffline(): Promise<void> {
      await transport.delete('/users/status');
    },
  };
}
