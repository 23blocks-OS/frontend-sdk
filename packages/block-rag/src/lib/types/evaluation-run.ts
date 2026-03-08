export interface EvaluationRunMetrics {
  avgPrecisionAtK?: number;
  avgRecallAtK?: number;
  avgMrr?: number;
  avgNdcgAtK?: number;
  hitRate?: number;
  avgLatencyMs?: number;
}

export interface EvaluationRunProgress {
  totalQuestions: number;
  completedQuestions: number;
  failedQuestions: number;
}

export interface EvaluationRun {
  id: string;
  uniqueId: string;
  datasetId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  configSnapshot?: Record<string, unknown>;
  recordsPerQuery?: number;
  rerankEnabled?: boolean;
  metrics: EvaluationRunMetrics;
  progress: EvaluationRunProgress;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  errorMessage?: string;
}

export interface CreateEvaluationRunRequest {
  recordsPerQuery?: number;
  rerankEnabled?: boolean;
}

export interface ListEvaluationRunsParams {
  page?: number;
  pageSize?: number;
  datasetId?: string;
}

export interface PollOptions {
  intervalMs?: number;
  timeoutMs?: number;
  onProgress?: (run: EvaluationRun) => void;
}
