import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  ListMessagesParams,
} from '../types/message.js';
import { messageMapper } from '../mappers/message.mapper.js';

export interface MessagesService {
  /**
   * List all messages
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of Message records with pagination metadata
   */
  list(params?: ListMessagesParams): Promise<PageResult<Message>>;

  /**
   * Get a message by unique ID
   * @param uniqueId - Unique ID of the message to retrieve
   * @returns The matching Message record
   */
  get(uniqueId: string): Promise<Message>;

  /**
   * Create a new message
   * @param data - Message creation payload including content, source, target, and routing fields
   * @returns The newly created Message record
   */
  create(data: CreateMessageRequest): Promise<Message>;

  /**
   * Update a message
   * @param uniqueId - Unique ID of the message to update
   * @param data - Fields to update (content, status, enabled, payload)
   * @returns The updated Message record
   */
  update(uniqueId: string, data: UpdateMessageRequest): Promise<Message>;

  /**
   * Delete a message (soft delete)
   * @param uniqueId - Unique ID of the message to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Recover a previously deleted message
   * @param uniqueId - Unique ID of the deleted message to recover
   * @returns The recovered Message record
   */
  recover(uniqueId: string): Promise<Message>;

  /**
   * List messages filtered by context
   * @param contextId - Context identifier to filter by
   * @param params - Optional sorting and pagination parameters
   * @returns Paginated list of Message records for the given context
   */
  listByContext(contextId: string, params?: ListMessagesParams): Promise<PageResult<Message>>;

  /**
   * List messages filtered by parent message
   * @param parentId - Parent message ID to filter replies
   * @param params - Optional sorting and pagination parameters
   * @returns Paginated list of child Message records for the given parent
   */
  listByParent(parentId: string, params?: ListMessagesParams): Promise<PageResult<Message>>;

  /**
   * List soft-deleted messages
   * @param params - Optional pagination parameters
   * @returns Paginated list of deleted Message records with pagination metadata
   */
  listDeleted(params?: ListMessagesParams): Promise<PageResult<Message>>;
}

export function createMessagesService(transport: Transport, _config: { appId: string }): MessagesService {
  return {
    async list(params?: ListMessagesParams): Promise<PageResult<Message>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contextId) queryParams['context_id'] = params.contextId;
      if (params?.parentId) queryParams['parent_id'] = params.parentId;
      if (params?.sourceId) queryParams['source_id'] = params.sourceId;
      if (params?.targetId) queryParams['target_id'] = params.targetId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/messages', { params: queryParams });
      return decodePageResult(response, messageMapper);
    },

    async get(uniqueId: string): Promise<Message> {
      const response = await transport.get<unknown>(`/messages/${uniqueId}`);
      return decodeOne(response, messageMapper);
    },

    async create(data: CreateMessageRequest): Promise<Message> {
      const response = await transport.post<unknown>('/messages', {
        message: {
            context_id: data.contextId,
            parent_id: data.parentId,
            content: data.content,
            source: data.source,
            source_id: data.sourceId,
            source_alias: data.sourceAlias,
            source_email: data.sourceEmail,
            source_phone: data.sourcePhone,
            source_type: data.sourceType,
            target: data.target,
            target_id: data.targetId,
            target_alias: data.targetAlias,
            target_email: data.targetEmail,
            target_phone: data.targetPhone,
            target_type: data.targetType,
            target_device_id: data.targetDeviceId,
            value: data.value,
            data_source: data.dataSource,
            data_source_id: data.dataSourceId,
            data_source_type: data.dataSourceType,
            data_source_alias: data.dataSourceAlias,
            notification_content: data.notificationContent,
            notification_url: data.notificationUrl,
            expires_at: data.expiresAt,
            rag_sources: data.ragSources,
            idempotency_key: data.idempotencyKey,
            payload: data.payload,
          },
      });
      return decodeOne(response, messageMapper);
    },

    async update(uniqueId: string, data: UpdateMessageRequest): Promise<Message> {
      const response = await transport.put<unknown>(`/messages/${uniqueId}`, {
        message: {
            content: data.content,
            status: data.status,
            enabled: data.enabled,
            payload: data.payload,
          },
      });
      return decodeOne(response, messageMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/messages/${uniqueId}`);
    },

    async recover(uniqueId: string): Promise<Message> {
      const response = await transport.put<unknown>(`/messages/${uniqueId}/recover`, {});
      return decodeOne(response, messageMapper);
    },

    async listByContext(contextId: string, params?: ListMessagesParams): Promise<PageResult<Message>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/messages/context/${contextId}`, { params: queryParams });
      return decodePageResult(response, messageMapper);
    },

    async listByParent(parentId: string, params?: ListMessagesParams): Promise<PageResult<Message>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/messages/parent/${parentId}`, { params: queryParams });
      return decodePageResult(response, messageMapper);
    },

    async listDeleted(params?: ListMessagesParams): Promise<PageResult<Message>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);

      const response = await transport.get<unknown>('/messages/trash/show', { params: queryParams });
      return decodePageResult(response, messageMapper);
    },
  };
}
