import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  DraftMessage,
  CreateDraftMessageRequest,
  UpdateDraftMessageRequest,
  ListDraftMessagesParams,
} from '../types/draft-message.js';
import { draftMessageMapper } from '../mappers/draft-message.mapper.js';

export interface DraftMessagesService {
  /**
   * List all draft messages
   * @param params - Optional filtering, sorting, and pagination parameters
   * @returns Paginated list of DraftMessage records with pagination metadata
   */
  list(params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>>;

  /**
   * Get a draft message by unique ID
   * @param uniqueId - Unique ID of the draft message to retrieve
   * @returns The matching DraftMessage record
   */
  get(uniqueId: string): Promise<DraftMessage>;

  /**
   * Create a new draft message
   * @param data - Draft message creation payload including content, source, target, and routing fields
   * @returns The newly created DraftMessage record
   */
  create(data: CreateDraftMessageRequest): Promise<DraftMessage>;

  /**
   * Update a draft message
   * @param uniqueId - Unique ID of the draft message to update
   * @param data - Fields to update (content, status, enabled, payload)
   * @returns The updated DraftMessage record
   */
  update(uniqueId: string, data: UpdateDraftMessageRequest): Promise<DraftMessage>;

  /**
   * Delete a draft message
   * @param uniqueId - Unique ID of the draft message to delete
   * @returns void on successful deletion
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * List draft messages filtered by context
   * @param contextId - Context identifier to filter by
   * @param params - Optional sorting and pagination parameters
   * @returns Paginated list of DraftMessage records for the given context
   */
  listByContext(contextId: string, params?: ListDraftMessagesParams): Promise<PageResult<DraftMessage>>;

  /**
   * Publish a draft message, converting it into a sent message
   * @param uniqueId - Unique ID of the draft message to publish
   * @returns The published DraftMessage record with updated status
   */
  publish(uniqueId: string): Promise<DraftMessage>;
}

export function createDraftMessagesService(transport: Transport, _config: { apiKey: string }): DraftMessagesService {
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
        draft_message: {
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
      return decodeOne(response, draftMessageMapper);
    },

    async update(uniqueId: string, data: UpdateDraftMessageRequest): Promise<DraftMessage> {
      const response = await transport.put<unknown>(`/draft_messages/${uniqueId}`, {
        draft_message: {
            content: data.content,
            status: data.status,
            enabled: data.enabled,
            payload: data.payload,
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
