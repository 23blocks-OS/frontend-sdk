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
  title?: string;
  messages: ConversationMessage[];
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConversationRequest {
  agentUniqueId?: string;
  userUniqueId?: string;
  title?: string;
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
