import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ListNotificationsParams,
} from '../types/notification';
import { notificationMapper } from '../mappers/notification.mapper';

export interface NotificationsService {
  list(params?: ListNotificationsParams): Promise<PageResult<Notification>>;
  get(uniqueId: string): Promise<Notification>;
  create(data: CreateNotificationRequest): Promise<Notification>;
  update(uniqueId: string, data: UpdateNotificationRequest): Promise<Notification>;
  delete(uniqueId: string): Promise<void>;
  markAsRead(uniqueId: string): Promise<Notification>;
  markAsUnread(uniqueId: string): Promise<Notification>;
  listByTarget(targetId: string, params?: ListNotificationsParams): Promise<PageResult<Notification>>;
  listUnread(params?: ListNotificationsParams): Promise<PageResult<Notification>>;
}

export function createNotificationsService(transport: Transport, _config: { appId: string }): NotificationsService {
  return {
    async list(params?: ListNotificationsParams): Promise<PageResult<Notification>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.targetId) queryParams['target_id'] = params.targetId;
      if (params?.sourceId) queryParams['source_id'] = params.sourceId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notifications', { params: queryParams });
      return decodePageResult(response, notificationMapper);
    },

    async get(uniqueId: string): Promise<Notification> {
      const response = await transport.get<unknown>(`/notifications/${uniqueId}`);
      return decodeOne(response, notificationMapper);
    },

    async create(data: CreateNotificationRequest): Promise<Notification> {
      const response = await transport.post<unknown>('/notifications', {
        notification: {
            content: data.content,
            source: data.source,
            source_alias: data.sourceAlias,
            source_id: data.sourceId,
            source_type: data.sourceType,
            url: data.url,
            target: data.target,
            target_id: data.targetId,
            target_alias: data.targetAlias,
            target_type: data.targetType,
            target_email: data.targetEmail,
            target_phone: data.targetPhone,
            target_device_id: data.targetDeviceId,
            multichannel: data.multichannel,
            expires_at: data.expiresAt,
            payload: data.payload,
          },
      });
      return decodeOne(response, notificationMapper);
    },

    async update(uniqueId: string, data: UpdateNotificationRequest): Promise<Notification> {
      const response = await transport.put<unknown>(`/notifications/${uniqueId}`, {
        notification: {
            content: data.content,
            url: data.url,
            status: data.status,
            payload: data.payload,
          },
      });
      return decodeOne(response, notificationMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/notifications/${uniqueId}`);
    },

    async markAsRead(uniqueId: string): Promise<Notification> {
      const response = await transport.put<unknown>(`/notifications/${uniqueId}/read`, {});
      return decodeOne(response, notificationMapper);
    },

    async markAsUnread(uniqueId: string): Promise<Notification> {
      const response = await transport.put<unknown>(`/notifications/${uniqueId}/unread`, {});
      return decodeOne(response, notificationMapper);
    },

    async listByTarget(targetId: string, params?: ListNotificationsParams): Promise<PageResult<Notification>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/notifications/target/${targetId}`, { params: queryParams });
      return decodePageResult(response, notificationMapper);
    },

    async listUnread(params?: ListNotificationsParams): Promise<PageResult<Notification>> {
      const queryParams: Record<string, string> = { status: 'pending' };
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.targetId) queryParams['target_id'] = params.targetId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/notifications/unread', { params: queryParams });
      return decodePageResult(response, notificationMapper);
    },
  };
}
