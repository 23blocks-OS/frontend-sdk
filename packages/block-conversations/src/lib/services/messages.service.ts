import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  ListMessagesParams,
} from '../types/message';
import { messageMapper } from '../mappers/message.mapper';

export interface MessagesService {
  list(params?: ListMessagesParams): Promise<PageResult<Message>>;
  get(uniqueId: string): Promise<Message>;
  create(data: CreateMessageRequest): Promise<Message>;
  update(uniqueId: string, data: UpdateMessageRequest): Promise<Message>;
  delete(uniqueId: string): Promise<void>;
  recover(uniqueId: string): Promise<Message>;
  listByContext(contextId: string, params?: ListMessagesParams): Promise<PageResult<Message>>;
  listByParent(parentId: string, params?: ListMessagesParams): Promise<PageResult<Message>>;
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
