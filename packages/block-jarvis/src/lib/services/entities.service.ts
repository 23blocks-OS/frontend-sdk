import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Entity,
  RegisterEntityRequest,
  UpdateEntityRequest,
  ListEntitiesParams,
  CreateContextRequest,
  SendMessageRequest,
} from '../types/entity.js';
import { entityMapper } from '../mappers/entity.mapper.js';

function buildEntityBody(data: RegisterEntityRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.code) body['code'] = data.code;
  if (data.entityType) body['entity_type'] = data.entityType;
  if (data.entityAlias) body['entity_alias'] = data.entityAlias;
  if (data.entitySource) body['entity_source'] = data.entitySource;
  if (data.entityUrl) body['entity_url'] = data.entityUrl;
  if (data.content) body['content'] = data.content;
  if (data.instructions) body['instructions'] = data.instructions;
  if (data.stripeId) body['stripe_id'] = data.stripeId;
  if (data.createdBy) body['created_by'] = data.createdBy;
  if (data.updatedBy) body['updated_by'] = data.updatedBy;
  if (data.status) body['status'] = data.status;
  if (data.timeZone) body['time_zone'] = data.timeZone;
  if (data.preferredLanguage) body['preferred_language'] = data.preferredLanguage;
  if (data.entityAvatarUrl) body['entity_avatar_url'] = data.entityAvatarUrl;
  return body;
}

function buildContextBody(data: CreateContextRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.uniqueId !== undefined) {
    assertUuid(data.uniqueId, 'context.uniqueId');
    body['unique_id'] = data.uniqueId;
  }
  if (data.name) body['name'] = data.name;
  if (data.reference) body['reference'] = data.reference;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.members) body['members'] = data.members;
  return body;
}

function buildMessageBody(data: SendMessageRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.role) body['role'] = data.role;
  if (data.content) body['content'] = data.content;
  if (data.fileIds) body['file_ids'] = data.fileIds;
  if (data.metadata) body['metadata'] = data.metadata;
  if (data.source) body['source'] = data.source;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceEmail) body['source_email'] = data.sourceEmail;
  if (data.sourcePhone) body['source_phone'] = data.sourcePhone;
  if (data.target) body['target'] = data.target;
  if (data.targetAlias) body['target_alias'] = data.targetAlias;
  if (data.targetId) body['target_id'] = data.targetId;
  if (data.targetType) body['target_type'] = data.targetType;
  if (data.targetEmail) body['target_email'] = data.targetEmail;
  if (data.targetPhone) body['target_phone'] = data.targetPhone;
  if (data.targetDeviceId) body['target_device_id'] = data.targetDeviceId;
  if (data.parentId) body['parent_id'] = data.parentId;
  if (data.value) body['value'] = data.value;
  if (data.dataSource) body['data_source'] = data.dataSource;
  if (data.dataSourceAlias) body['data_source_alias'] = data.dataSourceAlias;
  if (data.dataSourceId) body['data_source_id'] = data.dataSourceId;
  if (data.dataSourceType) body['data_source_type'] = data.dataSourceType;
  if (data.contextId) body['context_id'] = data.contextId;
  if (data.notificationContent) body['notification_content'] = data.notificationContent;
  if (data.notificationUrl) body['notification_url'] = data.notificationUrl;
  if (data.additionalData) body['additional_data'] = data.additionalData;
  return body;
}

export { buildContextBody, buildMessageBody };

export interface EntitiesService {
  list(params?: ListEntitiesParams): Promise<PageResult<Entity>>;
  get(uniqueId: string): Promise<Entity>;
  register(uniqueId: string, data?: RegisterEntityRequest): Promise<Entity>;
  update(uniqueId: string, data: UpdateEntityRequest): Promise<Entity>;
  delete(uniqueId: string): Promise<void>;
  addPrompt(uniqueId: string, promptUniqueId: string): Promise<void>;
  createContext(uniqueId: string, data?: CreateContextRequest): Promise<unknown>;
  sendMessage(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown>;
  sendMessageStream(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<ReadableStream<string>>;
}

export function createEntitiesService(transport: Transport, _config: { apiKey: string }, sseUrl?: string): EntitiesService {
  return {
    async list(params?: ListEntitiesParams): Promise<PageResult<Entity>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/entities', { params: queryParams });
      return decodePageResult(response, entityMapper);
    },

    async get(uniqueId: string): Promise<Entity> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/entities/${uniqueId}`);
      return decodeOne(response, entityMapper);
    },

    async register(uniqueId: string, data?: RegisterEntityRequest): Promise<Entity> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/entities/${uniqueId}/register`, {
        entity: data ? buildEntityBody(data) : {},
      });
      return decodeOne(response, entityMapper);
    },

    async update(uniqueId: string, data: UpdateEntityRequest): Promise<Entity> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/entities/${uniqueId}`, {
        entity: buildEntityBody(data),
      });
      return decodeOne(response, entityMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/entities/${uniqueId}`);
    },

    async addPrompt(uniqueId: string, promptUniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      assertUuid(promptUniqueId, 'promptUniqueId');
      await transport.post(`/entities/${uniqueId}/add_prompt`, {
        prompt: { unique_id: promptUniqueId },
      });
    },

    async createContext(uniqueId: string, data?: CreateContextRequest): Promise<unknown> {
      assertUuid(uniqueId, 'uniqueId');
      return transport.post(`/entities/${uniqueId}/create_context`, {
        context: data ? buildContextBody(data) : {},
      });
    },

    async sendMessage(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<unknown> {
      assertUuid(uniqueId, 'uniqueId');
      assertUuid(contextUniqueId, 'contextUniqueId');
      return transport.post(`/entities/${uniqueId}/contexts/${contextUniqueId}/send_message`, {
        message: buildMessageBody(data),
      });
    },

    async sendMessageStream(uniqueId: string, contextUniqueId: string, data: SendMessageRequest): Promise<ReadableStream<string>> {
      assertUuid(uniqueId, 'uniqueId');
      assertUuid(contextUniqueId, 'contextUniqueId');
      const response = await transport.post<Response>(
        `/entities/${uniqueId}/contexts/${contextUniqueId}/send_message_stream`,
        { message: buildMessageBody(data) },
        {
          responseType: 'stream',
          headers: { Accept: 'text/event-stream' },
          ...(sseUrl ? { baseUrl: sseUrl } : {}),
        },
      );

      if (response.body) {
        return response.body.pipeThrough(new TextDecoderStream());
      }
      throw new Error('Streaming not supported');
    },
  };
}
