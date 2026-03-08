export interface EvaluationResult {
  id: string;
  uniqueId: string;
  runId: string;
  questionId: string;
  queryText: string;
  retrievedFileIds?: string[];
  retrievedScores?: number[];
  precisionAtK?: number;
  recallAtK?: number;
  mrr?: number;
  ndcgAtK?: number;
  hit?: boolean;
  latencyMs?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface ListEvaluationResultsParams {
  page?: number;
  pageSize?: number;
}
