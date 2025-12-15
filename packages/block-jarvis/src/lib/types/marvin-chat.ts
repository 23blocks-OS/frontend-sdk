export interface MarvinContext {
  id: string;
  uniqueId: string;
  messages: MarvinMessage[];
  model?: string;
  temperature?: number;
  systemPrompt?: string;
  payload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface MarvinMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  payload?: Record<string, unknown>;
}

export interface MarvinChatRequest {
  message: string;
  contextUniqueId?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}

export interface MarvinChatResponse {
  response: string;
  contextUniqueId: string;
  tokens?: number;
  cost?: number;
  model?: string;
}

export interface CreateMarvinContextRequest {
  model?: string;
  temperature?: number;
  systemPrompt?: string;
  payload?: Record<string, unknown>;
}

export interface SendMarvinMessageRequest {
  message: string;
  payload?: Record<string, unknown>;
}

export interface SendMarvinMessageResponse {
  message: MarvinMessage;
  response: MarvinMessage;
  tokens?: number;
  cost?: number;
}
