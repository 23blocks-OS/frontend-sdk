import type { Transport, PageResult } from '@23blocks/contracts';
import type {
  AgentThread,
  AgentMessage,
  AgentContext,
  CreateAgentThreadRequest,
  CreateAgentContextRequest,
  SendAgentMessageRequest,
  AgentRunExecution,
  ListAgentRunExecutionsParams,
} from '../types/agent-runtime.js';
import { buildContextBody } from './entities.service.js';

function buildRuntimeMessageBody(data: SendAgentMessageRequest): Record<string, unknown> {
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

function parseAgentThread(response: any): AgentThread {
  return {
    id: response.id,
    threadId: response.thread_id,
    agentUniqueId: response.agent_unique_id,
    contextUniqueId: response.context_unique_id,
    status: response.status,
    metadata: response.metadata,
    createdAt: new Date(response.created_at),
    updatedAt: new Date(response.updated_at),
  };
}

function parseAgentMessage(m: any): AgentMessage {
  return {
    id: m.id,
    threadId: m.thread_id,
    role: m.role,
    content: (m.content || []).map((c: any) => ({
      type: c.type,
      text: c.text,
      imageFile: c.image_file,
      imageUrl: c.image_url,
    })),
    metadata: m.metadata,
    createdAt: new Date(m.created_at),
  };
}

export interface AgentRuntimeService {
  getContext(agentUniqueId: string, contextUniqueId: string): Promise<AgentContext>;
  createContext(agentUniqueId: string, data?: CreateAgentContextRequest): Promise<AgentContext>;
  getConversation(agentUniqueId: string, contextUniqueId: string): Promise<{ messages: AgentMessage[] }>;
  getThread(agentUniqueId: string, threadId: string): Promise<AgentThread>;
  createThread(agentUniqueId: string, data?: CreateAgentThreadRequest): Promise<AgentThread>;
  sendMessage(agentUniqueId: string, threadId: string, data: SendAgentMessageRequest): Promise<unknown>;
  sendMessageStream(agentUniqueId: string, threadId: string, data: SendAgentMessageRequest): Promise<ReadableStream<string>>;
  getMessages(agentUniqueId: string, threadId: string): Promise<AgentMessage[]>;
  listExecutions(agentUniqueId: string, params?: ListAgentRunExecutionsParams): Promise<PageResult<AgentRunExecution>>;
  getExecution(agentUniqueId: string, executionUniqueId: string): Promise<AgentRunExecution>;
}

export function createAgentRuntimeService(transport: Transport, _config: { appId: string }): AgentRuntimeService {
  return {
    async getContext(agentUniqueId: string, contextUniqueId: string): Promise<AgentContext> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/context/${contextUniqueId}`);
      return {
        thread: parseAgentThread(response.thread || response),
        conversation: response.conversation ? {
          uniqueId: response.conversation.unique_id,
          messages: (response.conversation.messages || []).map(parseAgentMessage),
        } : undefined,
      };
    },

    async createContext(agentUniqueId: string, data?: CreateAgentContextRequest): Promise<AgentContext> {
      const response = await transport.post<any>(`/agents/${agentUniqueId}/context`, data ? {
        context: buildContextBody(data),
      } : {});
      return {
        thread: parseAgentThread(response.thread || response),
      };
    },

    async getConversation(agentUniqueId: string, contextUniqueId: string): Promise<{ messages: AgentMessage[] }> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/conversations/${contextUniqueId}`);
      return {
        messages: (response.messages || []).map(parseAgentMessage),
      };
    },

    async getThread(agentUniqueId: string, threadId: string): Promise<AgentThread> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/threads/${threadId}`);
      return parseAgentThread(response);
    },

    async createThread(agentUniqueId: string, data?: CreateAgentThreadRequest): Promise<AgentThread> {
      const body: Record<string, unknown> = {};
      if (data?.metadata) body['metadata'] = data.metadata;
      if (data?.fileIds) body['file_ids'] = data.fileIds;
      const response = await transport.post<any>(`/agents/${agentUniqueId}/thread`, body);
      return parseAgentThread(response);
    },

    async sendMessage(agentUniqueId: string, threadId: string, data: SendAgentMessageRequest): Promise<unknown> {
      const requestBody: Record<string, unknown> = {
        message: buildRuntimeMessageBody(data),
      };
      if (data.promptUniqueId) {
        requestBody['prompt'] = { unique_id: data.promptUniqueId };
      }
      return transport.post<unknown>(`/agents/${agentUniqueId}/threads/${threadId}/messages`, requestBody);
    },

    async sendMessageStream(agentUniqueId: string, threadId: string, data: SendAgentMessageRequest): Promise<ReadableStream<string>> {
      const requestBody: Record<string, unknown> = {
        message: buildRuntimeMessageBody(data),
      };
      if (data.promptUniqueId) {
        requestBody['prompt'] = { unique_id: data.promptUniqueId };
      }
      const response = await transport.post<Response>(
        `/agents/${agentUniqueId}/threads/${threadId}/messages/stream`,
        requestBody,
        { responseType: 'stream' } as any,
      );

      if (response.body) {
        return response.body.pipeThrough(new TextDecoderStream());
      }
      throw new Error('Streaming not supported');
    },

    async getMessages(agentUniqueId: string, threadId: string): Promise<AgentMessage[]> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/threads/${threadId}/messages`);
      return (response.messages || response || []).map(parseAgentMessage);
    },

    async listExecutions(agentUniqueId: string, params?: ListAgentRunExecutionsParams): Promise<PageResult<AgentRunExecution>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.perPage) queryParams['records'] = String(params.perPage);
      if (params?.status) queryParams['status'] = params.status;
      if (params?.sortBy) queryParams['sort'] = params.sortOrder === 'desc' ? `-${params.sortBy}` : params.sortBy;

      const response = await transport.get<any>(`/agents/${agentUniqueId}/executions`, { params: queryParams });
      const data = response.data || [];
      return {
        data: data.map((e: any) => ({
          id: e.id,
          uniqueId: e.unique_id,
          agentUniqueId: e.agent_unique_id,
          runId: e.run_id,
          threadId: e.thread_id,
          status: e.status,
          input: e.input,
          output: e.output,
          tokens: e.tokens,
          cost: e.cost,
          duration: e.duration,
          error: e.error,
          createdAt: new Date(e.created_at),
          updatedAt: new Date(e.updated_at),
        })),
        meta: {
          totalCount: response.meta?.total_count || data.length,
          currentPage: response.meta?.current_page || 1,
          perPage: response.meta?.per_page || data.length,
          totalPages: response.meta?.total_pages || 1,
        },
      };
    },

    async getExecution(agentUniqueId: string, executionUniqueId: string): Promise<AgentRunExecution> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/executions/${executionUniqueId}`);
      return {
        id: response.id,
        uniqueId: response.unique_id,
        agentUniqueId: response.agent_unique_id,
        runId: response.run_id,
        threadId: response.thread_id,
        status: response.status,
        input: response.input,
        output: response.output,
        tokens: response.tokens,
        cost: response.cost,
        duration: response.duration,
        error: response.error,
        createdAt: new Date(response.created_at),
        updatedAt: new Date(response.updated_at),
      };
    },
  };
}
