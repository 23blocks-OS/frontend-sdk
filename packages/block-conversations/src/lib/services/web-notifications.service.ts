import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  WebNotification,
  CreateWebNotificationRequest,
  BulkWebNotificationRequest,
  ListWebNotificationsParams,
} from '../types/web-notification';
import { webNotificationMapper } from '../mappers/web-notification.mapper';

export interface WebNotificationsService {
  list(params?: ListWebNotificationsParams): Promise<PageResult<WebNotification>>;
  get(uniqueId: string): Promise<WebNotification>;
  send(data: CreateWebNotificationRequest): Promise<WebNotification>;
  sendBulk(data: BulkWebNotificationRequest): Promise<{ sent: number; failed: number }>;
  markAsRead(uniqueId: string): Promise<WebNotification>;
  markAsClicked(uniqueId: string): Promise<WebNotification>;
  markAllAsRead(recipientUniqueId: string): Promise<{ updated: number }>;
  delete(uniqueId: string): Promise<void>;
}

export function createWebNotificationsService(transport: Transport, _config: { appId: string }): WebNotificationsService {
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
