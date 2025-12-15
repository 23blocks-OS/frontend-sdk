import type { Transport } from '@23blocks/contracts';
import type {
  UserAvailability,
  SetAvailabilityRequest,
} from '../types/availability';

export interface AvailabilitiesService {
  get(userUniqueId: string): Promise<UserAvailability>;
  goOnline(data?: SetAvailabilityRequest): Promise<UserAvailability>;
  goOffline(): Promise<void>;
}

export function createAvailabilitiesService(transport: Transport, _config: { appId: string }): AvailabilitiesService {
  return {
    async get(userUniqueId: string): Promise<UserAvailability> {
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
