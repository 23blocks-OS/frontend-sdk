import type { Transport, BlockConfig } from '@23blocks/contracts';
import type {
  AnalyticsDateRange,
  AnalyticsOverview,
  AnalyticsUsageParams,
  AnalyticsUsageItem,
  AnalyticsCostParams,
  AnalyticsCostItem,
  AnalyticsFeedback,
  AnalyticsConversations,
  AnalyticsRag,
  AnalyticsAgentItem,
  AnalyticsTrace,
} from '../types/analytics.js';

// ── Response envelope shapes ────────────────────────────────────────────────

interface AnalyticsSingleton {
  data: { id: number; type: string; attributes: Record<string, unknown> };
}

interface AnalyticsCollection {
  data: Array<{ id: number; type: string; attributes: Record<string, unknown> }>;
}

// ── Snake → camelCase helper ────────────────────────────────────────────────

function camelCase(s: string): string {
  return s.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function mapKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(mapKeys);
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      result[camelCase(k)] = mapKeys(v);
    }
    return result;
  }
  return obj;
}

// ── Query param builders ────────────────────────────────────────────────────

function dateParams(p?: AnalyticsDateRange): Record<string, string | undefined> {
  return {
    start_date: p?.startDate,
    end_date: p?.endDate,
  };
}

// ── Service interface ───────────────────────────────────────────────────────

export interface AnalyticsService {
  getOverview(params?: AnalyticsDateRange): Promise<AnalyticsOverview>;
  getUsage(params?: AnalyticsUsageParams): Promise<AnalyticsUsageItem[]>;
  getCosts(params?: AnalyticsCostParams): Promise<AnalyticsCostItem[]>;
  getFeedback(params?: AnalyticsDateRange): Promise<AnalyticsFeedback>;
  getConversations(params?: AnalyticsDateRange): Promise<AnalyticsConversations>;
  getRag(params?: AnalyticsDateRange): Promise<AnalyticsRag>;
  getAgents(params?: AnalyticsDateRange): Promise<AnalyticsAgentItem[]>;
  getTrace(requestId: string): Promise<AnalyticsTrace>;
}

// ── Factory ─────────────────────────────────────────────────────────────────

export function createAnalyticsService(
  transport: Transport,
  _config: BlockConfig,
): AnalyticsService {

  async function singleton<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
    const response = await transport.get<AnalyticsSingleton>(path, { params });
    return mapKeys(response.data.attributes) as T;
  }

  async function collection<T>(path: string, params?: Record<string, string | undefined>): Promise<T[]> {
    const response = await transport.get<AnalyticsCollection>(path, { params });
    return response.data.map((item: { attributes: Record<string, unknown> }) => mapKeys(item.attributes) as T);
  }

  return {
    getOverview(params?: AnalyticsDateRange) {
      return singleton<AnalyticsOverview>('/analytics/overview', dateParams(params));
    },

    getUsage(params?: AnalyticsUsageParams) {
      return collection<AnalyticsUsageItem>('/analytics/usage', {
        ...dateParams(params),
        granularity: params?.granularity,
        model: params?.model,
        agent: params?.agent,
        prompt: params?.prompt,
        trigger_type: params?.triggerType,
      });
    },

    getCosts(params?: AnalyticsCostParams) {
      return collection<AnalyticsCostItem>('/analytics/costs', {
        ...dateParams(params),
        breakdown: params?.breakdown,
        granularity: params?.granularity,
      });
    },

    getFeedback(params?: AnalyticsDateRange) {
      return singleton<AnalyticsFeedback>('/analytics/feedback', dateParams(params));
    },

    getConversations(params?: AnalyticsDateRange) {
      return singleton<AnalyticsConversations>('/analytics/conversations', dateParams(params));
    },

    getRag(params?: AnalyticsDateRange) {
      return singleton<AnalyticsRag>('/analytics/rag', dateParams(params));
    },

    getAgents(params?: AnalyticsDateRange) {
      return collection<AnalyticsAgentItem>('/analytics/agents', dateParams(params));
    },

    async getTrace(requestId: string) {
      return singleton<AnalyticsTrace>(`/analytics/trace/${requestId}`);
    },
  };
}
