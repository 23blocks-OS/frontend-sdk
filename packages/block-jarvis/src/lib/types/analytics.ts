// ── Shared ──────────────────────────────────────────────────────────────────

export interface AnalyticsDateRange {
  startDate?: string;
  endDate?: string;
}

// ── Overview ────────────────────────────────────────────────────────────────

export interface AnalyticsOverview {
  totalExecutions: number;
  totalCost: number;
  avgLatencyMs: number;
  errorCount: number;
  errorRate: number;
  feedback: { likes: number; dislikes: number; comments: number };
  activeAgents: number;
  activePrompts: number;
}

// ── Usage ───────────────────────────────────────────────────────────────────

export interface AnalyticsUsageParams extends AnalyticsDateRange {
  granularity?: 'hour' | 'day' | 'week' | 'month';
  model?: string;
  agent?: string;
  prompt?: string;
  triggerType?: string;
}

export interface AnalyticsUsageItem {
  period: string;
  requestCount: number;
  totalCost: number;
  avgLatencyMs: number;
}

// ── Costs ───────────────────────────────────────────────────────────────────

export interface AnalyticsCostParams extends AnalyticsDateRange {
  breakdown?: 'model' | 'agent' | 'prompt' | 'time';
  granularity?: 'hour' | 'day' | 'week' | 'month';
}

export interface AnalyticsCostItem {
  model?: string;
  agentUniqueId?: string;
  agentName?: string | null;
  promptUniqueId?: string;
  promptName?: string | null;
  period?: string;
  inputCost?: number;
  outputCost?: number;
  executionCount?: number;
  totalCost: number;
}

// ── Feedback ────────────────────────────────────────────────────────────────

export interface AnalyticsFeedback {
  totalLikes: number;
  totalDislikes: number;
  totalComments: number;
  satisfactionRate: number;
  byPrompt: Array<{
    promptUniqueId: string;
    promptName: string | null;
    likes: number;
    dislikes: number;
    comments: number;
  }>;
  dailyTrend: Array<{ period: string; likes: number }>;
}

// ── Conversations ───────────────────────────────────────────────────────────

export interface AnalyticsConversations {
  totalConversations: number;
  avgMessagesPerConversation: number;
  maxMessages: number;
  minMessages: number;
  distribution: Array<{ messages: number; conversations: number }>;
}

// ── RAG ─────────────────────────────────────────────────────────────────────

export interface AnalyticsRag {
  totalQueries: number;
  successfulQueries: number;
  errorCount: number;
  errorRate: number;
  latency: {
    avgTotalMs: number;
    avgEmbeddingMs: number;
    avgSearchMs: number;
    avgRerankingMs: number;
  };
  relevance: {
    avgTopScore: number;
    avgAvgScore: number;
    avgResultsReturned: number;
  };
  errorBreakdown: Array<{ errorType: string; count: number }>;
}

// ── Agents ──────────────────────────────────────────────────────────────────

export interface AnalyticsAgentItem {
  agentUniqueId: string;
  agentName: string | null;
  executionCount: number;
  totalCost: number;
  avgLatencyMs: number;
  errorCount: number;
  successRate: number;
  likes: number;
  dislikes: number;
}

// ── Trace ───────────────────────────────────────────────────────────────────

export interface AnalyticsTrace {
  promptExecution: {
    uniqueId: string;
    promptUniqueId: string;
    promptVersionUniqueId: string;
    model: string;
    status: string;
    executionTime: number;
    inputTokenCost: number;
    outputTokenCost: number;
    totalTokenCost: number;
    triggerType: string;
    triggerUniqueId: string;
    threadId: string | null;
    startedAt: string | null;
    completedAt: string | null;
    createdAt: string;
  };
  runExecution: {
    uniqueId: string;
    model: string;
    status: string;
    executionTime: number;
    totalTokenCost: number;
    threadId: string | null;
    createdAt: string;
  } | null;
  ragQueries: Array<{
    id: number;
    queryText: string;
    totalMs: number;
    resultsReturned: number;
    topScore: number | null;
    errorType: string | null;
    createdAt: string;
  }>;
  feedback: {
    likes: number;
    dislikes: number;
    comments: Array<{
      uniqueId: string;
      content: string;
      createdAt: string;
    }>;
  };
}
