import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  Agent,
  CreateAgentRequest,
  UpdateAgentRequest,
  ListAgentsParams,
  ChatRequest,
  ChatResponse,
  CompleteRequest,
  CompleteResponse,
} from '../types/agent';
import { agentMapper } from '../mappers/agent.mapper';

export interface AgentsService {
  list(params?: ListAgentsParams): Promise<PageResult<Agent>>;
  get(uniqueId: string): Promise<Agent>;
  create(data: CreateAgentRequest): Promise<Agent>;
  update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent>;
  delete(uniqueId: string): Promise<void>;
  chat(uniqueId: string, data: ChatRequest): Promise<ChatResponse>;
  complete(uniqueId: string, data: CompleteRequest): Promise<CompleteResponse>;
}

export function createAgentsService(transport: Transport, _config: { appId: string }): AgentsService {
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
      const response = await transport.get<unknown>(`/agents/${uniqueId}`);
      return decodeOne(response, agentMapper);
    },

    async create(data: CreateAgentRequest): Promise<Agent> {
      const response = await transport.post<unknown>('/agents', {
        data: {
          type: 'Agent',
          attributes: {
            code: data.code,
            name: data.name,
            description: data.description,
            system_prompt: data.systemPrompt,
            model: data.model,
            temperature: data.temperature,
            max_tokens: data.maxTokens,
            tools: data.tools,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, agentMapper);
    },

    async update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent> {
      const response = await transport.put<unknown>(`/agents/${uniqueId}`, {
        data: {
          type: 'Agent',
          attributes: {
            name: data.name,
            description: data.description,
            system_prompt: data.systemPrompt,
            model: data.model,
            temperature: data.temperature,
            max_tokens: data.maxTokens,
            tools: data.tools,
            enabled: data.enabled,
            status: data.status,
            payload: data.payload,
          },
        },
      });
      return decodeOne(response, agentMapper);
    },

    async delete(uniqueId: string): Promise<void> {
      await transport.delete(`/agents/${uniqueId}`);
    },

    async chat(uniqueId: string, data: ChatRequest): Promise<ChatResponse> {
      const response = await transport.post<any>(`/agents/${uniqueId}/chat`, {
        message: data.message,
        conversation_unique_id: data.conversationUniqueId,
        user_unique_id: data.userUniqueId,
        payload: data.payload,
      });

      return {
        response: response.response,
        conversationUniqueId: response.conversation_unique_id,
        executionUniqueId: response.execution_unique_id,
        tokens: response.tokens,
        cost: response.cost,
      };
    },

    async complete(uniqueId: string, data: CompleteRequest): Promise<CompleteResponse> {
      const response = await transport.post<any>(`/agents/${uniqueId}/complete`, {
        input: data.input,
        payload: data.payload,
      });

      return {
        output: response.output,
        executionUniqueId: response.execution_unique_id,
        tokens: response.tokens,
        cost: response.cost,
        duration: response.duration,
      };
    },
  };
}
