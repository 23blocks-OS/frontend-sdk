import type { Transport, PageResult } from '@23blocks/contracts';
import type {
  AgentThread,
  AgentRun,
  AgentMessage,
  AgentContext,
  CreateAgentThreadRequest,
  CreateAgentContextRequest,
  SendAgentThreadMessageRequest,
  SendAgentThreadMessageResponse,
  RunAgentThreadRequest,
  RunAgentThreadResponse,
  AgentRunExecution,
  ListAgentRunExecutionsParams,
} from '../types/agent-runtime';

export interface AgentRuntimeService {
  getContext(agentUniqueId: string, contextUniqueId: string): Promise<AgentContext>;
  createContext(agentUniqueId: string, data?: CreateAgentContextRequest): Promise<AgentContext>;
  getConversation(agentUniqueId: string, contextUniqueId: string): Promise<{ messages: AgentMessage[] }>;
  getThread(agentUniqueId: string, threadId: string): Promise<AgentThread>;
  createThread(agentUniqueId: string, data?: CreateAgentThreadRequest): Promise<AgentThread>;
  sendMessage(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Promise<SendAgentThreadMessageResponse>;
  sendMessageStream(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Promise<ReadableStream<string>>;
  runThread(agentUniqueId: string, threadId: string, data?: RunAgentThreadRequest): Promise<RunAgentThreadResponse>;
  getRun(agentUniqueId: string, threadId: string, runId: string): Promise<AgentRun>;
  getMessages(agentUniqueId: string, threadId: string): Promise<AgentMessage[]>;
  listExecutions(agentUniqueId: string, params?: ListAgentRunExecutionsParams): Promise<PageResult<AgentRunExecution>>;
  getExecution(agentUniqueId: string, executionUniqueId: string): Promise<AgentRunExecution>;
}

export function createAgentRuntimeService(transport: Transport, _config: { appId: string }): AgentRuntimeService {
  return {
    async getContext(agentUniqueId: string, contextUniqueId: string): Promise<AgentContext> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/context/${contextUniqueId}`);
      return {
        thread: {
          id: response.thread?.id,
          threadId: response.thread?.thread_id,
          agentUniqueId: response.thread?.agent_unique_id,
          contextUniqueId: response.thread?.context_unique_id,
          status: response.thread?.status,
          metadata: response.thread?.metadata,
          createdAt: new Date(response.thread?.created_at),
          updatedAt: new Date(response.thread?.updated_at),
        },
        conversation: response.conversation ? {
          uniqueId: response.conversation.unique_id,
          messages: (response.conversation.messages || []).map((m: any) => ({
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
          })),
        } : undefined,
      };
    },

    async createContext(agentUniqueId: string, data?: CreateAgentContextRequest): Promise<AgentContext> {
      const response = await transport.post<any>(`/agents/${agentUniqueId}/context`, {
        metadata: data?.metadata,
      });
      return {
        thread: {
          id: response.thread?.id,
          threadId: response.thread?.thread_id,
          agentUniqueId: response.thread?.agent_unique_id,
          contextUniqueId: response.thread?.context_unique_id,
          status: response.thread?.status,
          metadata: response.thread?.metadata,
          createdAt: new Date(response.thread?.created_at),
          updatedAt: new Date(response.thread?.updated_at),
        },
      };
    },

    async getConversation(agentUniqueId: string, contextUniqueId: string): Promise<{ messages: AgentMessage[] }> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/conversations/${contextUniqueId}`);
      return {
        messages: (response.messages || []).map((m: any) => ({
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
        })),
      };
    },

    async getThread(agentUniqueId: string, threadId: string): Promise<AgentThread> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/threads/${threadId}`);
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
    },

    async createThread(agentUniqueId: string, data?: CreateAgentThreadRequest): Promise<AgentThread> {
      const response = await transport.post<any>(`/agents/${agentUniqueId}/thread`, {
        metadata: data?.metadata,
      });
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
    },

    async sendMessage(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Promise<SendAgentThreadMessageResponse> {
      const response = await transport.post<any>(`/agents/${agentUniqueId}/threads/${threadId}/messages`, {
        message: data.message,
        metadata: data.metadata,
      });
      return {
        message: {
          id: response.id,
          threadId: response.thread_id,
          role: response.role,
          content: (response.content || []).map((c: any) => ({
            type: c.type,
            text: c.text,
            imageFile: c.image_file,
            imageUrl: c.image_url,
          })),
          metadata: response.metadata,
          createdAt: new Date(response.created_at),
        },
      };
    },

    async sendMessageStream(agentUniqueId: string, threadId: string, data: SendAgentThreadMessageRequest): Promise<ReadableStream<string>> {
      const response = await transport.post<Response>(`/agents/${agentUniqueId}/threads/${threadId}/messages/stream`, {
        message: data.message,
        metadata: data.metadata,
      }, { responseType: 'stream' } as any);

      if (response.body) {
        return response.body.pipeThrough(new TextDecoderStream());
      }
      throw new Error('Streaming not supported');
    },

    async runThread(agentUniqueId: string, threadId: string, data?: RunAgentThreadRequest): Promise<RunAgentThreadResponse> {
      const response = await transport.post<any>(`/agents/${agentUniqueId}/threads/${threadId}/runs`, {
        instructions: data?.instructions,
        additional_instructions: data?.additionalInstructions,
        tools: data?.tools,
        metadata: data?.metadata,
      });
      return {
        run: {
          id: response.id,
          runId: response.run_id,
          threadId: response.thread_id,
          agentUniqueId: response.agent_unique_id,
          status: response.status,
          model: response.model,
          instructions: response.instructions,
          tools: response.tools,
          startedAt: response.started_at ? new Date(response.started_at) : undefined,
          completedAt: response.completed_at ? new Date(response.completed_at) : undefined,
          failedAt: response.failed_at ? new Date(response.failed_at) : undefined,
          cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
          expiresAt: response.expires_at ? new Date(response.expires_at) : undefined,
          lastError: response.last_error,
          usage: response.usage ? {
            promptTokens: response.usage.prompt_tokens,
            completionTokens: response.usage.completion_tokens,
            totalTokens: response.usage.total_tokens,
          } : undefined,
          metadata: response.metadata,
          createdAt: new Date(response.created_at),
        },
      };
    },

    async getRun(agentUniqueId: string, threadId: string, runId: string): Promise<AgentRun> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/threads/${threadId}/runs/${runId}`);
      return {
        id: response.id,
        runId: response.run_id,
        threadId: response.thread_id,
        agentUniqueId: response.agent_unique_id,
        status: response.status,
        model: response.model,
        instructions: response.instructions,
        tools: response.tools,
        startedAt: response.started_at ? new Date(response.started_at) : undefined,
        completedAt: response.completed_at ? new Date(response.completed_at) : undefined,
        failedAt: response.failed_at ? new Date(response.failed_at) : undefined,
        cancelledAt: response.cancelled_at ? new Date(response.cancelled_at) : undefined,
        expiresAt: response.expires_at ? new Date(response.expires_at) : undefined,
        lastError: response.last_error,
        usage: response.usage ? {
          promptTokens: response.usage.prompt_tokens,
          completionTokens: response.usage.completion_tokens,
          totalTokens: response.usage.total_tokens,
        } : undefined,
        metadata: response.metadata,
        createdAt: new Date(response.created_at),
      };
    },

    async getMessages(agentUniqueId: string, threadId: string): Promise<AgentMessage[]> {
      const response = await transport.get<any>(`/agents/${agentUniqueId}/threads/${threadId}/messages`);
      return (response.messages || response || []).map((m: any) => ({
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
      }));
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
          page: response.meta?.page || 1,
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
