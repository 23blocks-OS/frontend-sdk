import type { Message } from './message';

export interface ConversationFile {
  uniqueId: string;
  name: string;
  url: string;
  type?: string;
  size?: number;
}

export interface ConversationMeta {
  totalMessages?: number;
  unreadCount?: number;
  lastMessageAt?: Date;
  participants?: string[];
  [key: string]: unknown;
}

export interface Conversation {
  id: string;
  context: string;
  messages: Message[];
  files?: ConversationFile[];
  meta?: ConversationMeta;
}

// Request types
export interface GetConversationParams {
  context: string;
  page?: number;
  perPage?: number;
  includeFiles?: boolean;
}
