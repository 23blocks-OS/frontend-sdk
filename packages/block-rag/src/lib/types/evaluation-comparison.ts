import type { EvaluationRunMetrics } from './evaluation-run.js';

export interface EvaluationComparisonMetricDelta {
  metric: string;
  run1: number;
  run2: number;
  delta: number;
  percentChange: number;
}

export interface EvaluationComparisonPerQuestion {
  questionId: string;
  queryText: string;
  precisionDelta?: number;
  recallDelta?: number;
  mrrDelta?: number;
  ndcgDelta?: number;
  latencyDeltaMs?: number;
  hitRun1?: boolean;
  hitRun2?: boolean;
}

export interface EvaluationComparisonRunSummary {
  id: string;
  datasetId: string;
  status: string;
  metrics: EvaluationRunMetrics;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface EvaluationComparisonResult {
  run1: EvaluationComparisonRunSummary;
  run2: EvaluationComparisonRunSummary;
  metrics: EvaluationComparisonMetricDelta[];
  perQuestion: EvaluationComparisonPerQuestion[];
  summary: {
    improved: number;
    degraded: number;
    unchanged: number;
  };
}

export interface EvaluationComparisonParams {
  runId1: string;
  runId2: string;
}
