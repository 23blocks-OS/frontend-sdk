import type { Transport, PageResult } from '@23blocks/contracts';
import { decodeMany, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EvaluationQuestion,
  CreateEvaluationQuestionsRequest,
  ListEvaluationQuestionsParams,
} from '../types/evaluation-question.js';
import { evaluationQuestionMapper } from '../mappers/evaluation-question.mapper.js';
import type { RagBlockConfig } from '../rag.block.js';

export interface EvaluationQuestionsService {
  createBatch(datasetId: string, data: CreateEvaluationQuestionsRequest): Promise<EvaluationQuestion[]>;
  list(datasetId: string, params?: ListEvaluationQuestionsParams): Promise<PageResult<EvaluationQuestion>>;
}

export function createEvaluationQuestionsService(
  transport: Transport,
  _config: RagBlockConfig
): EvaluationQuestionsService {
  return {
    async createBatch(datasetId: string, data: CreateEvaluationQuestionsRequest): Promise<EvaluationQuestion[]> {
      const response = await transport.post<unknown>(`/evaluations/${datasetId}/questions`, {
        questions: data.questions.map((q) => ({
          question: q.question,
          ground_truth_answer: q.groundTruthAnswer,
          relevant_file_ids: q.relevantFileIds,
          entity_id: q.entityId,
          tags: q.tags,
        })),
      });
      return decodeMany(response, evaluationQuestionMapper);
    },

    async list(datasetId: string, params?: ListEvaluationQuestionsParams): Promise<PageResult<EvaluationQuestion>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.pageSize) queryParams['page_size'] = String(params.pageSize);

      const response = await transport.get<unknown>(`/evaluations/${datasetId}/questions`, { params: queryParams });
      return decodePageResult(response, evaluationQuestionMapper);
    },
  };
}
