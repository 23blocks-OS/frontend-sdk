import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EvaluationResult } from '../types/evaluation-result.js';
import { parseString, parseNumber } from './utils.js';

export const evaluationResultMapper: ResourceMapper<EvaluationResult> = {
  type: 'rag_eval_result',

  map(resource: JsonApiResource, _included: IncludedMap): EvaluationResult {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) || resource.id,
      runId: parseString(attrs.run_id),
      questionId: parseString(attrs.question_id),
      queryText: parseString(attrs.query_text),
      retrievedFileIds: Array.isArray(attrs.retrieved_file_ids) ? attrs.retrieved_file_ids.map(String) : undefined,
      retrievedScores: Array.isArray(attrs.retrieved_scores) ? attrs.retrieved_scores.map(Number) : undefined,
      precisionAtK: attrs.precision_at_k != null ? parseNumber(attrs.precision_at_k) : undefined,
      recallAtK: attrs.recall_at_k != null ? parseNumber(attrs.recall_at_k) : undefined,
      mrr: attrs.mrr != null ? parseNumber(attrs.mrr) : undefined,
      ndcgAtK: attrs.ndcg_at_k != null ? parseNumber(attrs.ndcg_at_k) : undefined,
      hit: attrs.hit != null ? Boolean(attrs.hit) : undefined,
      latencyMs: attrs.latency_ms != null ? parseNumber(attrs.latency_ms) : undefined,
      errorMessage: attrs.error_message != null ? parseString(attrs.error_message) : undefined,
      createdAt: parseString(attrs.created_at),
    };
  },
};
