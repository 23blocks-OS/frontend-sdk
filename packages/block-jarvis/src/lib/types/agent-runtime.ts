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

export interface AgentRun {
  id: string;
  runId: string;
  threadId: string;
  agentUniqueId: string;
  status: string;
  model?: string;
  instructions?: string;
  tools?: unknown[];
  startedAt?: Date;
  completedAt?: Date;
  failedAt?: Date;
  cancelledAt?: Date;
  expiresAt?: Date;
  lastError?: {
    code: string;
    message: string;
  };
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata?: Record<string, unknown>;
  createdAt: Date;
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

export interface CreateAgentThreadRequest {
  metadata?: Record<string, unknown>;
}

export interface CreateAgentContextRequest {
  metadata?: Record<string, unknown>;
}

export interface SendAgentThreadMessageRequest {
  message: string;
  metadata?: Record<string, unknown>;
}

export interface SendAgentThreadMessageResponse {
  message: AgentMessage;
}

export interface SendAgentThreadMessageStreamRequest {
  message: string;
  metadata?: Record<string, unknown>;
}

export interface RunAgentThreadRequest {
  instructions?: string;
  additionalInstructions?: string;
  tools?: unknown[];
  metadata?: Record<string, unknown>;
}

export interface RunAgentThreadResponse {
  run: AgentRun;
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
