import type { Message } from './message.js';

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

export interface UnreadSummaryBucket {
  key: string;
  unreadCount: number;
  conversationCount: number;
  conversationPayload?: Record<string, unknown>;
}

export interface UnreadSummary {
  buckets: UnreadSummaryBucket[];
  totalUnreadCount: number;
  totalConversationCount: number;
  groupBy: string;
}

export interface UnreadSummaryParams {
  /** Group by: 'reference', 'source', 'source_type', 'source_alias', or 'payload:<key_name>' */
  groupBy?: string;
  /** Custom filters for drill-down, e.g. { project_id: 'P1', role: 'Developer' } */
  custom?: Record<string, string>;
}

export interface ConversationSummaryContent {
  summary: string;
  keyPoints?: string[];
  actionItems?: string[];
}

export interface ConversationSummary {
  contextUniqueId: string;
  status: 'completed' | 'pending' | 'failed' | 'stale';
  content?: ConversationSummaryContent;
  messageCount?: number;
  fromCache?: boolean;
}

export interface DigestRequest {
  contextUniqueIds: string[];
  promptId?: string;
}

// Request types
export interface GetConversationParams {
  context: string;
  page?: number;
  perPage?: number;
  includeFiles?: boolean;
}
