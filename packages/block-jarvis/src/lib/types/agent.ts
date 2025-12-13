import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface Agent extends IdentityCore {
  code: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  status: EntityStatus;
  enabled: boolean;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateAgentRequest {
  code: string;
  name: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  payload?: Record<string, unknown>;
}

export interface UpdateAgentRequest {
  name?: string;
  description?: string;
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: string[];
  enabled?: boolean;
  status?: EntityStatus;
  payload?: Record<string, unknown>;
}

export interface ListAgentsParams {
  page?: number;
  perPage?: number;
  status?: EntityStatus;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ChatRequest {
  message: string;
  conversationUniqueId?: string;
  userUniqueId?: string;
  payload?: Record<string, unknown>;
}

export interface ChatResponse {
  response: string;
  conversationUniqueId: string;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
}

export interface CompleteRequest {
  input: string;
  payload?: Record<string, unknown>;
}

export interface CompleteResponse {
  output: string;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
  duration?: number;
}
