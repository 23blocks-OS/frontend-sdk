import type { Transport } from '@23blocks/contracts';
import type {
  NotificationSettings,
  UpdateNotificationSettingsRequest,
} from '../types/notification-settings.js';

export interface NotificationSettingsService {
  /**
   * Get notification settings for a user
   * @param userUniqueId - Unique ID of the user
   * @returns NotificationSettings with channel toggles, quiet hours, timezone, and preferences
   */
  get(userUniqueId: string): Promise<NotificationSettings>;

  /**
   * Update notification settings for a user
   * @param userUniqueId - Unique ID of the user
   * @param data - Settings fields to update (channel toggles, quiet hours, timezone, preferences)
   * @returns The updated NotificationSettings record
   */
  update(userUniqueId: string, data: UpdateNotificationSettingsRequest): Promise<NotificationSettings>;
}

export function createNotificationSettingsService(transport: Transport, _config: { apiKey: string }): NotificationSettingsService {
  return {
    async get(userUniqueId: string): Promise<NotificationSettings> {
      const response = await transport.get<{ data: any }>(`/users/${userUniqueId}/notifications/settings`);
      const attrs = response.data?.attributes || response.data || {};

      return {
        userUniqueId,
        emailEnabled: attrs.email_enabled,
        pushEnabled: attrs.push_enabled,
        smsEnabled: attrs.sms_enabled,
        inAppEnabled: attrs.in_app_enabled,
        quietHoursStart: attrs.quiet_hours_start,
        quietHoursEnd: attrs.quiet_hours_end,
        timezone: attrs.timezone,
        preferences: attrs.preferences,
        payload: attrs.payload,
      };
    },

    async update(userUniqueId: string, data: UpdateNotificationSettingsRequest): Promise<NotificationSettings> {
      const response = await transport.put<{ data: any }>(`/users/${userUniqueId}/notifications/settings`, {
        notification_settings: {
          email_enabled: data.emailEnabled,
          push_enabled: data.pushEnabled,
          sms_enabled: data.smsEnabled,
          in_app_enabled: data.inAppEnabled,
          quiet_hours_start: data.quietHoursStart,
          quiet_hours_end: data.quietHoursEnd,
          timezone: data.timezone,
          preferences: data.preferences,
          payload: data.payload,
        },
      });

      const attrs = response.data?.attributes || response.data || {};

      return {
        userUniqueId,
        emailEnabled: attrs.email_enabled,
        pushEnabled: attrs.push_enabled,
        smsEnabled: attrs.sms_enabled,
        inAppEnabled: attrs.in_app_enabled,
        quietHoursStart: attrs.quiet_hours_start,
        quietHoursEnd: attrs.quiet_hours_end,
        timezone: attrs.timezone,
        preferences: attrs.preferences,
        payload: attrs.payload,
      };
    },
  };
}
