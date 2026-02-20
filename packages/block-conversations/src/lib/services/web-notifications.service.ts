import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  WebNotification,
  CreateWebNotificationRequest,
  BulkWebNotificationRequest,
  ListWebNotificationsParams,
} from '../types/web-notification.js';
import { webNotificationMapper } from '../mappers/web-notification.mapper.js';

export interface WebNotificationsService {
  /**
   * List all web notifications
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of WebNotification records with pagination metadata
   */
  list(params?: ListWebNotificationsParams): Promise<PageResult<WebNotification>>;

  /**
   * Get a web notification by unique ID
   * @param uniqueId - Unique ID of the web notification to retrieve
   * @returns The matching WebNotification record
   */
  get(uniqueId: string): Promise<WebNotification>;

  /**
   * Send a web notification to a single recipient
   * @param data - Notification payload including recipient, title, body, and optional action URL
   * @returns The newly created WebNotification record
   */
  send(data: CreateWebNotificationRequest): Promise<WebNotification>;

  /**
   * Send a web notification to multiple recipients
   * @param data - Bulk notification payload including recipient IDs, title, body, and optional action URL
   * @returns Object with sent and failed counts indicating delivery results
   */
  sendBulk(data: BulkWebNotificationRequest): Promise<{ sent: number; failed: number }>;

  /**
   * Mark a web notification as read
   * @param uniqueId - Unique ID of the web notification to mark as read
   * @returns The updated WebNotification record with read status
   */
  markAsRead(uniqueId: string): Promise<WebNotification>;

  /**
   * Mark a web notification as clicked
   * @param uniqueId - Unique ID of the web notification to mark as clicked
   * @returns The updated WebNotification record with clicked status
   */
  markAsClicked(uniqueId: string): Promise<WebNotification>;

  /**
   * Mark all web notifications as read for a recipient
   * @param recipientUniqueId - Unique ID of the recipient whose notifications should be marked as read
   * @returns Object with the count of updated notifications
   */
  markAllAsRead(recipientUniqueId: string): Promise<{ updated: number }>;

  /**
   * Delete a web notification
   * @param uniqueId - Unique ID of the web notification to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;
}

export function createWebNotificationsService(transport: Transport, _config: { apiKey: string }): WebNotificationsService {
  return {
    async list(params?: ListWebNotificationsParams): Promise<PageResult<WebNotification>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.recipientUniqueId) queryParams['recipient_unique_id'] = params.recipientUniqueId;
      if (params?.notificationType) queryParams['notification_type'] = params.notificationType;
      if (params?.priority) queryParams['priority'] = params.priority;
      if (params?.isRead !== undefined) queryParams['is_read'] = String(params.isRead);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/web_notifications', { params: queryParams });
      return decodePageResult(response, webNotificationMapper);
    },

    async get(uniqueId: string): Promise<WebNotification> {
      const response = await transport.get<unknown>(`/web_notifications/${uniqueId}`);
      return decodeOne(response, webNotificationMapper);
    },

    async send(data: CreateWebNotificationRequest): Promise<WebNotification> {
      const response = await transport.post<unknown>('/web_notifications', {
        web_notification: {
          recipient_unique_id: data.recipientUniqueId,
          title: data.title,
          body: data.body,
          icon: data.icon,
          image_url: data.imageUrl,
          action_url: data.actionUrl,
          notification_type: data.notificationType,
          priority: data.priority,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return decodeOne(response, webNotificationMapper);
    },

    async sendBulk(data: BulkWebNotificationRequest): Promise<{ sent: number; failed: number }> {
      const response = await transport.post<Record<string, unknown>>('/web_notifications/bulk', {
        web_notification: {
          recipient_unique_ids: data.recipientUniqueIds,
          title: data.title,
          body: data.body,
          icon: data.icon,
          image_url: data.imageUrl,
          action_url: data.actionUrl,
          notification_type: data.notificationType,
          priority: data.priority,
          payload: data.payload,
          tags: data.tags,
        },
      });
      return {
        sent: Number(response.sent ?? 0),
        failed: Number(response.failed ?? 0),
      };
    },

    async markAsRead(uniqueId: string): Promise<WebNotification> {
      const response = await transport.put<unknown>(`/web_notifications/${uniqueId}/read`, {});
      return decodeOne(response, webNotificationMapper);
    },

    async markAsClicked(uniqueId: string): Promise<WebNotification> {
      const response = await transport.put<unknown>(`/web_notifications/${uniqueId}/click`, {});
      return decodeOne(response, webNotificationMapper);
    },

    async markAllAsRead(recipientUniqueId: string): Promise<{ updated: number }> {
      const response = await transport.put<Record<string, unknown>>('/web_notifications/read_all', {
        recipient_unique_id: recipientUniqueId,
      });
      return {
        updated: Number(response.updated ?? 0),
      };
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/web_notifications/${uniqueId}`);
    },
  };
}
