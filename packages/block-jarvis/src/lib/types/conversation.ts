import type { IdentityCore, EntityStatus } from '@23blocks/contracts';

export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  payload?: Record<string, unknown>;
}

export interface Conversation extends IdentityCore {
  agentUniqueId?: string;
  userUniqueId?: string;
  title?: string;
  messages: ConversationMessage[];
  status: EntityStatus;
  payload?: Record<string, unknown>;
}

// Request types
export interface CreateConversationRequest {
  agentUniqueId?: string;
  userUniqueId?: string;
  title?: string;
  payload?: Record<string, unknown>;
}

export interface SendMessageRequest {
  message: string;
  role?: 'user' | 'assistant' | 'system';
  payload?: Record<string, unknown>;
}

export interface SendMessageResponse {
  message: ConversationMessage;
  response?: ConversationMessage;
  executionUniqueId?: string;
  tokens?: number;
  cost?: number;
}

export interface ListConversationsParams {
  page?: number;
  perPage?: number;
  agentUniqueId?: string;
  userUniqueId?: string;
  status?: EntityStatus;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
