import type { Transport } from '@23blocks/contracts';
import type {
  EvaluationComparisonParams,
  EvaluationComparisonResult,
  EvaluationComparisonRunSummary,
  EvaluationComparisonMetricDelta,
  EvaluationComparisonPerQuestion,
} from '../types/evaluation-comparison.js';
import type { RagBlockConfig } from '../rag.block.js';

export interface EvaluationComparisonService {
  compare(params: EvaluationComparisonParams): Promise<EvaluationComparisonResult>;
}

function mapRunSummary(raw: Record<string, unknown>): EvaluationComparisonRunSummary {
  const metrics = (raw.metrics as Record<string, unknown>) ?? {};
  return {
    id: String(raw.id ?? ''),
    datasetId: String(raw.dataset_id ?? ''),
    status: String(raw.status ?? ''),
    metrics: {
      avgPrecisionAtK: metrics.avg_precision_at_k != null ? Number(metrics.avg_precision_at_k) : undefined,
      avgRecallAtK: metrics.avg_recall_at_k != null ? Number(metrics.avg_recall_at_k) : undefined,
      avgMrr: metrics.avg_mrr != null ? Number(metrics.avg_mrr) : undefined,
      avgNdcgAtK: metrics.avg_ndcg_at_k != null ? Number(metrics.avg_ndcg_at_k) : undefined,
      hitRate: metrics.hit_rate != null ? Number(metrics.hit_rate) : undefined,
      avgLatencyMs: metrics.avg_latency_ms != null ? Number(metrics.avg_latency_ms) : undefined,
    },
    startedAt: raw.started_at != null ? String(raw.started_at) : undefined,
    completedAt: raw.completed_at != null ? String(raw.completed_at) : undefined,
    createdAt: String(raw.created_at ?? ''),
  };
}

function mapMetricDelta(raw: Record<string, unknown>): EvaluationComparisonMetricDelta {
  return {
    metric: String(raw.metric ?? ''),
    run1: Number(raw.run_1 ?? 0),
    run2: Number(raw.run_2 ?? 0),
    delta: Number(raw.delta ?? 0),
    percentChange: Number(raw.percent_change ?? 0),
  };
}

function mapPerQuestion(raw: Record<string, unknown>): EvaluationComparisonPerQuestion {
  return {
    questionId: String(raw.question_id ?? ''),
    queryText: String(raw.query_text ?? ''),
    precisionDelta: raw.precision_delta != null ? Number(raw.precision_delta) : undefined,
    recallDelta: raw.recall_delta != null ? Number(raw.recall_delta) : undefined,
    mrrDelta: raw.mrr_delta != null ? Number(raw.mrr_delta) : undefined,
    ndcgDelta: raw.ndcg_delta != null ? Number(raw.ndcg_delta) : undefined,
    latencyDeltaMs: raw.latency_delta_ms != null ? Number(raw.latency_delta_ms) : undefined,
    hitRun1: raw.hit_run_1 != null ? Boolean(raw.hit_run_1) : undefined,
    hitRun2: raw.hit_run_2 != null ? Boolean(raw.hit_run_2) : undefined,
  };
}

export function createEvaluationComparisonService(
  transport: Transport,
  _config: RagBlockConfig
): EvaluationComparisonService {
  return {
    async compare(params: EvaluationComparisonParams): Promise<EvaluationComparisonResult> {
      const response = await transport.get<{
        data: {
          type: string;
          attributes: Record<string, unknown>;
        };
      }>('/evaluations/runs/compare', {
        params: {
          run_id_1: params.runId1,
          run_id_2: params.runId2,
        },
      });

      const attrs = response.data.attributes;
      const run1Raw = (attrs.run_1 as Record<string, unknown>) ?? {};
      const run2Raw = (attrs.run_2 as Record<string, unknown>) ?? {};
      const metricsRaw = (attrs.metrics as Record<string, unknown>[]) ?? [];
      const perQuestionRaw = (attrs.per_question as Record<string, unknown>[]) ?? [];
      const summaryRaw = (attrs.summary as Record<string, unknown>) ?? {};

      return {
        run1: mapRunSummary(run1Raw),
        run2: mapRunSummary(run2Raw),
        metrics: metricsRaw.map(mapMetricDelta),
        perQuestion: perQuestionRaw.map(mapPerQuestion),
        summary: {
          improved: Number(summaryRaw.improved ?? 0),
          degraded: Number(summaryRaw.degraded ?? 0),
          unchanged: Number(summaryRaw.unchanged ?? 0),
        },
      };
    },
  };
}
