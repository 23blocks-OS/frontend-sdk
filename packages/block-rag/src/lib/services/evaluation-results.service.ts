import type { Transport, PageResult } from '@23blocks/contracts';
import { decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EvaluationResult,
  ListEvaluationResultsParams,
} from '../types/evaluation-result.js';
import { evaluationResultMapper } from '../mappers/evaluation-result.mapper.js';
import type { RagBlockConfig } from '../rag.block.js';

export interface EvaluationResultsService {
  list(runId: string, params?: ListEvaluationResultsParams): Promise<PageResult<EvaluationResult>>;
}

export function createEvaluationResultsService(
  transport: Transport,
  _config: RagBlockConfig
): EvaluationResultsService {
  return {
    async list(runId: string, params?: ListEvaluationResultsParams): Promise<PageResult<EvaluationResult>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.pageSize) queryParams['page_size'] = String(params.pageSize);

      const response = await transport.get<unknown>(`/evaluations/runs/${runId}/results`, { params: queryParams });
      return decodePageResult(response, evaluationResultMapper);
    },
  };
}
