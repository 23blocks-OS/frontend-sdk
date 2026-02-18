import type { CreateContextRequest, SendMessageRequest } from './entity.js';

export interface AgentThread {
  id: string;
  threadId: string;
  agentUniqueId: string;
  contextUniqueId?: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentMessage {
  id: string;
  threadId: string;
  role: 'user' | 'assistant';
  content: AgentMessageContent[];
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export interface AgentMessageContent {
  type: 'text' | 'image_file' | 'image_url';
  text?: {
    value: string;
    annotations?: unknown[];
  };
  imageFile?: {
    fileId: string;
  };
  imageUrl?: {
    url: string;
    detail?: string;
  };
}

export interface AgentContext {
  thread: AgentThread;
  conversation?: {
    uniqueId: string;
    messages: AgentMessage[];
  };
}

/** Matches thread_params in agents_runtime_controller.rb (create_thread) */
export interface CreateAgentThreadRequest {
  metadata?: Record<string, unknown>;
  fileIds?: string[];
}

/** Matches context_params in agents_runtime_controller.rb (create_context) */
export type CreateAgentContextRequest = CreateContextRequest;

/** Matches message_params + prompt_params in agents_runtime_controller.rb */
export interface SendAgentMessageRequest {
  promptUniqueId?: string;
  role?: string;
  content: string;
  fileIds?: string[];
  metadata?: Record<string, unknown>;
  source?: string;
  sourceAlias?: string;
  sourceId?: string;
  sourceType?: string;
  sourceEmail?: string;
  sourcePhone?: string;
  target?: string;
  targetAlias?: string;
  targetId?: string;
  targetType?: string;
  targetEmail?: string;
  targetPhone?: string;
  targetDeviceId?: string;
  parentId?: string;
  value?: string;
  dataSource?: string;
  dataSourceAlias?: string;
  dataSourceId?: string;
  dataSourceType?: string;
  contextId?: string;
  notificationContent?: string;
  notificationUrl?: string;
  additionalData?: string;
}

export interface AgentRunExecution {
  id: string;
  uniqueId: string;
  agentUniqueId: string;
  runId?: string;
  threadId?: string;
  status: string;
  input?: string;
  output?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListAgentRunExecutionsParams {
  page?: number;
  perPage?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export type { CreateContextRequest, SendMessageRequest };
