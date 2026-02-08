import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ListNotificationsParams,
} from '../types/notification.js';
import { notificationMapper } from '../mappers/notification.mapper.js';

export interface NotificationsService {
  /**
   * List all notifications
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Notification records with pagination metadata
   */
  list(params?: ListNotificationsParams): Promise<PageResult<Notification>>;

  /**
   * Get a notification by unique ID
   * @param uniqueId - Unique ID of the notification to retrieve
   * @returns The matching Notification record
   */
  get(uniqueId: string): Promise<Notification>;

  /**
   * Create a new notification
   * @param data - Notification creation payload including content, source, target, and delivery options
   * @returns The newly created Notification record
   */
  create(data: CreateNotificationRequest): Promise<Notification>;

  /**
   * Update a notification
   * @param uniqueId - Unique ID of the notification to update
   * @param data - Fields to update (content, url, status, payload)
   * @returns The updated Notification record
   */
  update(uniqueId: string, data: UpdateNotificationRequest): Promise<Notification>;

  /**
   * Delete a notification
   * @param uniqueId - Unique ID of the notification to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Mark a notification as read
   * @param uniqueId - Unique ID of the notification to mark as read
   * @returns The updated Notification record with read status
   */
  markAsRead(uniqueId: string): Promise<Notification>;

  /**
   * Mark a notification as unread
   * @param uniqueId - Unique ID of the notification to mark as unread
   * @returns The updated Notification record with unread status
   */
  markAsUnread(uniqueId: string): Promise<Notification>;

  /**
   * List notifications filtered by target
   * @param targetId - Target ID to filter notifications for
   * @param params - Optional sorting and pagination parameters
   * @returns Paginated list of Notification records for the given target
   */
  listByTarget(targetId: string, params?: ListNotificationsParams): Promise<PageResult<Notification>>;

  /**
   * List unread notifications
   * @param params - Optional filtering and pagination parameters
   * @returns Paginated list of unread Notification records
   * @note Automatically filters by status "pending"
   */
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
