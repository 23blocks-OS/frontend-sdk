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
  /**
   * AI-generated digest, populated when `GetConversationParams.include`
   * contains `'summary'`. Returned via the JSON:API `included[]` array.
   * Survives summary regeneration.
   */
  summary?: ConversationSummary;
  /**
   * Persistent action items auto-created from AI summaries, populated when
   * `GetConversationParams.include` contains `'tasks'`. Returned via the
   * JSON:API `included[]` array. Tasks survive summary regeneration.
   */
  tasks?: Task[];
}

/**
 * A persistent action item tied to a conversation, auto-created from AI
 * summaries and user-scoped. Survives summary regeneration.
 */
export interface Task {
  uniqueId: string;
  description: string;
  priority?: string;
  status?: 'pending' | 'completed' | 'dismissed' | string;
  completedAt?: Date;
  dismissedAt?: Date;
  contextUniqueId?: string;
  userUniqueId?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  /** Sentiment classification (e.g., 'positive', 'neutral', 'negative'). */
  sentiment?: string;
  /** Backend-side summary variant identifier (e.g., 'standard', 'brief'). */
  summaryType?: string;
}

export interface DigestRequest {
  contextUniqueIds: string[];
  promptId?: string;
}

export interface DigestResponse {
  summaries: ConversationSummary[];
  /** Number of conversations found matching the request IDs */
  conversationsFound: number;
  /** Number of summaries successfully generated */
  total: number;
  /** Error message if Jarvis AI processing failed */
  error?: string;
}

// Request types
export interface GetConversationParams {
  context: string;
  page?: number;
  perPage?: number;
  includeFiles?: boolean;
  /**
   * JSON:API relationships to include in the response (e.g., `'summary'`,
   * `'tasks'`). The SDK auto-includes `'messages'` and (when
   * `includeFiles` is set) `'message_files'`. Use this for the new
   * `'summary'` and `'tasks'` relationships added in 2026-05-29.
   */
  include?: Array<'summary' | 'tasks' | 'conversation' | 'messages' | 'message_files'>;
}
