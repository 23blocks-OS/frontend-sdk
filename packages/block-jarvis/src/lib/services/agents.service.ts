import type { Transport, PageResult } from '@23blocks/contracts';
import { assertUuid } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  ListAgentsParams,
  AddAgentPromptRequest,
  AddAgentEntityRequest,
} from '../types/agent.js';
import { agentMapper } from '../mappers/agent.mapper.js';

function buildAgentBody(data: CreateAgentRequest): Record<string, unknown> {
  const body: Record<string, unknown> = {};
  if (data.code) body['code'] = data.code;
  if (data.name) body['name'] = data.name;
  if (data.description) body['description'] = data.description;
  if (data.status) body['status'] = data.status;
  if (data.instructions) body['instructions'] = data.instructions;
  if (data.provider) body['provider'] = data.provider;
  if (data.model) body['model'] = data.model;
  if (data.source) body['source'] = data.source;
  if (data.sourceId) body['source_id'] = data.sourceId;
  if (data.sourceType) body['source_type'] = data.sourceType;
  if (data.sourceAlias) body['source_alias'] = data.sourceAlias;
  if (data.contentUrl) body['content_url'] = data.contentUrl;
  if (data.imageUrl) body['image_url'] = data.imageUrl;
  if (data.videoUrl) body['video_url'] = data.videoUrl;
  if (data.agentIdentifier) body['agent_identifier'] = data.agentIdentifier;
  if (data.ragEnabled !== undefined) body['rag_enabled'] = data.ragEnabled;
  if (data.contextWindow !== undefined) body['context_window'] = data.contextWindow;
  if (data.encryptionKey) body['encryption_key'] = data.encryptionKey;
  if (data.rateLimitPerHour !== undefined) body['rate_limit_per_hour'] = data.rateLimitPerHour;
  if (data.communicationEnabled !== undefined) body['communication_enabled'] = data.communicationEnabled;
  if (data.email) body['email'] = data.email;
  if (data.emailProcessorUrl) body['email_processor_url'] = data.emailProcessorUrl;
  if (data.allowedDomains) body['allowed_domains'] = data.allowedDomains;
  if (data.phoneNumber) body['phone_number'] = data.phoneNumber;
  if (data.smsProcessorUrl) body['sms_processor_url'] = data.smsProcessorUrl;
  if (data.integrationServicesEnabled !== undefined) body['integration_services_enabled'] = data.integrationServicesEnabled;
  if (data.webhookUrl) body['webhook_url'] = data.webhookUrl;
  if (data.webhookSecret) body['webhook_secret'] = data.webhookSecret;
  if (data.apiUrl) body['api_url'] = data.apiUrl;
  if (data.imEnabled !== undefined) body['im_enabled'] = data.imEnabled;
  if (data.imAppsConfig) body['im_apps_config'] = data.imAppsConfig;
  if (data.supervisorEnabled !== undefined) body['supervisor_enabled'] = data.supervisorEnabled;
  if (data.supervisorEmail) body['supervisor_email'] = data.supervisorEmail;
  if (data.supervisorPhoneNumber) body['supervisor_phone_number'] = data.supervisorPhoneNumber;
  if (data.supervisorUserUid) body['supervisor_user_uid'] = data.supervisorUserUid;
  if (data.lastActivityAt) body['last_activity_at'] = data.lastActivityAt;
  if (data.totalMessagesProcessed !== undefined) body['total_messages_processed'] = data.totalMessagesProcessed;
  if (data.averageResponseTime !== undefined) body['average_response_time'] = data.averageResponseTime;
  if (data.errorCount !== undefined) body['error_count'] = data.errorCount;
  if (data.successRate !== undefined) body['success_rate'] = data.successRate;
  return body;
}

export interface AgentsService {
  list(params?: ListAgentsParams): Promise<PageResult<Agent>>;
  get(uniqueId: string): Promise<Agent>;
  create(data: CreateAgentRequest): Promise<Agent>;
  update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent>;
  delete(uniqueId: string): Promise<void>;
  addPrompt(uniqueId: string, data: AddAgentPromptRequest): Promise<Agent>;
  addEntity(uniqueId: string, data: AddAgentEntityRequest): Promise<Agent>;
  removeEntity(uniqueId: string, data: AddAgentEntityRequest): Promise<Agent>;
}

export function createAgentsService(transport: Transport, _config: { apiKey: string }): AgentsService {
  return {
    async list(params?: ListAgentsParams): Promise<PageResult<Agent>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.search) queryParams['search'] = params.search;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<unknown>('/agents', { params: queryParams });
      return decodePageResult(response, agentMapper);
    },

    async get(uniqueId: string): Promise<Agent> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.get<unknown>(`/agents/${uniqueId}`);
      return decodeOne(response, agentMapper);
    },

    async create(data: CreateAgentRequest): Promise<Agent> {
      const response = await transport.post<unknown>('/agents', {
        agent: buildAgentBody(data),
      });
      return decodeOne(response, agentMapper);
    },

    async update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.put<unknown>(`/agents/${uniqueId}`, {
        agent: buildAgentBody(data),
      });
      return decodeOne(response, agentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      assertUuid(uniqueId, 'uniqueId');
      await transport.delete(`/agents/${uniqueId}`);
    },

    async addPrompt(uniqueId: string, data: AddAgentPromptRequest): Promise<Agent> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/agents/${uniqueId}/add_prompt`, {
        prompt: { unique_id: data.uniqueId },
      });
      return decodeOne(response, agentMapper);
    },

    async addEntity(uniqueId: string, data: AddAgentEntityRequest): Promise<Agent> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/agents/${uniqueId}/add_entity`, {
        entity: {
          entity_unique_id: data.entityUniqueId,
          ...(data.relationType && { relation_type: data.relationType }),
        },
      });
      return decodeOne(response, agentMapper);
    },

    async removeEntity(uniqueId: string, data: AddAgentEntityRequest): Promise<Agent> {
      assertUuid(uniqueId, 'uniqueId');
      const response = await transport.post<unknown>(`/agents/${uniqueId}/remove_entity`, {
        entity: {
          entity_unique_id: data.entityUniqueId,
          ...(data.relationType && { relation_type: data.relationType }),
        },
      });
      return decodeOne(response, agentMapper);
    },
  };
}
