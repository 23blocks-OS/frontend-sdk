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
} from '../types/agent.js';
import { agentMapper } from '../mappers/agent.mapper.js';

export interface AgentsService {
  /**
   * List agents with optional filtering and sorting.
   * @returns Paginated list of Agent records with metadata.
   */
  list(params?: ListAgentsParams): Promise<PageResult<Agent>>;

  /**
   * Get a single agent by unique ID.
   * @returns The matching Agent record.
   */
  get(uniqueId: string): Promise<Agent>;

  /**
   * Create a new agent.
   * @returns The newly created Agent record.
   */
  create(data: CreateAgentRequest): Promise<Agent>;

  /**
   * Update an existing agent.
   * @returns The updated Agent record.
   */
  update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent>;

  /**
   * Delete an agent.
   */
  delete(uniqueId: string): Promise<void>;

  /**
   * Send a chat message to an agent.
   * @returns ChatResponse with the agent's reply, token usage, and cost.
   */
  chat(uniqueId: string, data: ChatRequest): Promise<ChatResponse>;

  /**
   * Send a completion request to an agent.
   * @returns CompleteResponse with output, token usage, cost, and duration.
   */
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
        agent: {
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
      });
      return decodeOne(response, agentMapper);
    },

    async update(uniqueId: string, data: UpdateAgentRequest): Promise<Agent> {
      const response = await transport.put<unknown>(`/agents/${uniqueId}`, {
        agent: {
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
