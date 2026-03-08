import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EvaluationRun } from '../types/evaluation-run.js';
import { parseString, parseNumber } from './utils.js';

export const evaluationRunMapper: ResourceMapper<EvaluationRun> = {
  type: 'rag_eval_run',

  map(resource: JsonApiResource, _included: IncludedMap): EvaluationRun {
    const attrs = resource.attributes ?? {};
    const metrics = (attrs.metrics as Record<string, unknown>) ?? {};
    const progress = (attrs.progress as Record<string, unknown>) ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) || resource.id,
      datasetId: parseString(attrs.dataset_id),
      status: (parseString(attrs.status) || 'pending') as EvaluationRun['status'],
      configSnapshot: attrs.config_snapshot as Record<string, unknown> | undefined,
      recordsPerQuery: attrs.records_per_query != null ? parseNumber(attrs.records_per_query) : undefined,
      rerankEnabled: attrs.rerank_enabled != null ? Boolean(attrs.rerank_enabled) : undefined,
      metrics: {
        avgPrecisionAtK: metrics.avg_precision_at_k != null ? parseNumber(metrics.avg_precision_at_k) : undefined,
        avgRecallAtK: metrics.avg_recall_at_k != null ? parseNumber(metrics.avg_recall_at_k) : undefined,
        avgMrr: metrics.avg_mrr != null ? parseNumber(metrics.avg_mrr) : undefined,
        avgNdcgAtK: metrics.avg_ndcg_at_k != null ? parseNumber(metrics.avg_ndcg_at_k) : undefined,
        hitRate: metrics.hit_rate != null ? parseNumber(metrics.hit_rate) : undefined,
        avgLatencyMs: metrics.avg_latency_ms != null ? parseNumber(metrics.avg_latency_ms) : undefined,
      },
      progress: {
        totalQuestions: parseNumber(progress.total_questions),
        completedQuestions: parseNumber(progress.completed_questions),
        failedQuestions: parseNumber(progress.failed_questions),
      },
      startedAt: attrs.started_at != null ? parseString(attrs.started_at) : undefined,
      completedAt: attrs.completed_at != null ? parseString(attrs.completed_at) : undefined,
      createdAt: parseString(attrs.created_at),
      errorMessage: attrs.error_message != null ? parseString(attrs.error_message) : undefined,
    };
  },
};
