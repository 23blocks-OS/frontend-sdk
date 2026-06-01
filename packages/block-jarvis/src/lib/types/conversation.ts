export interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Conversation {
  id: string;
  uniqueId: string;
  agentUniqueId?: string;
  userUniqueId?: string;
  /**
   * Human-readable conversation name. Maps to the backend's `name`
   * attribute. (Earlier SDK versions called this `title`, but the
   * Conversations API never had a `title` field — the rename happened
   * in 2026-06-01 to align with the actual API contract.)
   */
  name?: string;
  messages: ConversationMessage[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationRequest {
  agentUniqueId?: string;
  userUniqueId?: string;
  /** Conversation name. Maps to backend's `name` attribute. */
  name?: string;
}

export interface SendConversationMessageRequest {
  message: string;
  role?: 'user' | 'assistant' | 'system';
}

export interface SendConversationMessageResponse {
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
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
