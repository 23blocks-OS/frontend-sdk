import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  DraftMessage,
  CreateDraftMessageRequest,
  UpdateDraftMessageRequest,
  ListDraftMessagesParams,
} from '../types/draft-message';
import { draftMessageMapper } from '../mappers/draft-message.mapper';

export interface DraftMessagesService {
  list(params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>>;
  get(uniqueId: string): Promise<DraftMessage>;
  create(data: CreateDraftMessageRequest): Promise<DraftMessage>;
  update(uniqueId: string, data: UpdateDraftMessageRequest): Promise<DraftMessage>;
  delete(uniqueId: string): Promise<void>;
  listByContext(contextId: string, params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>>;
  publish(uniqueId: string): Promise<DraftMessage>;
}

export function createDraftMessagesService(transport: Transport, _config: { appId: string }): DraftMessagesService {
  return {
    async list(params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.contextId) queryParams['context_id'] = params.contextId;
      if (params?.sourceId) queryParams['source_id'] = params.sourceId;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/draft_messages', { params: queryParams });
      return decodePageResult(response, draftMessageMapper);
    },

    async get(uniqueId: string): Promise<DraftMessage> {
      const response = await transport.get<unknown>(`/draft_messages/${uniqueId}`);
      return decodeOne(response, draftMessageMapper);
    },

    async create(data: CreateDraftMessageRequest): Promise<DraftMessage> {
      const response = await transport.post<unknown>('/draft_messages', {
        data: {
          type: 'DraftMessage',
          attributes: {
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
        },
      });
      return decodeOne(response, draftMessageMapper);
    },

    async update(uniqueId: string, data: UpdateDraftMessageRequest): Promise<DraftMessage> {
      const response = await transport.put<unknown>(`/draft_messages/${uniqueId}`, {
        data: {
          type: 'DraftMessage',
          attributes: {
            content: data.content,
            status: data.status,
            enabled: data.enabled,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, draftMessageMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/draft_messages/${uniqueId}`);
    },

    async listByContext(contextId: string, params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>(`/draft_messages/context/${contextId}`, { params: queryParams });
      return decodePageResult(response, draftMessageMapper);
    },

    async publish(uniqueId: string): Promise<DraftMessage> {
      const response = await transport.put<unknown>(`/draft_messages/${uniqueId}/publish`, {});
      return decodeOne(response, draftMessageMapper);
    },
  };
}
