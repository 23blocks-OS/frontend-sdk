export interface EvaluationQuestion {
  id: string;
  uniqueId: string;
  datasetId: string;
  question: string;
  groundTruthAnswer?: string;
  relevantFileIds?: string[];
  entityId?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateEvaluationQuestionsRequest {
  questions: Array<{
    question: string;
    groundTruthAnswer?: string;
    relevantFileIds?: string[];
    entityId?: string;
    tags?: string[];
  }>;
}

export interface ListEvaluationQuestionsParams {
  page?: number;
  pageSize?: number;
}
