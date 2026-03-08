import type { Transport, PageResult } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EvaluationRun,
  CreateEvaluationRunRequest,
  ListEvaluationRunsParams,
  PollOptions,
} from '../types/evaluation-run.js';
import { evaluationRunMapper } from '../mappers/evaluation-run.mapper.js';
import type { RagBlockConfig } from '../rag.block.js';

const TERMINAL_STATUSES = ['completed', 'failed', 'cancelled'];

export interface EvaluationRunsService {
  create(datasetId: string, data?: CreateEvaluationRunRequest): Promise<EvaluationRun>;
  get(runId: string): Promise<EvaluationRun>;
  list(params?: ListEvaluationRunsParams): Promise<PageResult<EvaluationRun>>;
  cancel(runId: string): Promise<EvaluationRun>;
  pollUntilComplete(runId: string, options?: PollOptions): Promise<EvaluationRun>;
}

export function createEvaluationRunsService(
  transport: Transport,
  _config: RagBlockConfig
): EvaluationRunsService {
  const service: EvaluationRunsService = {
    async create(datasetId: string, data?: CreateEvaluationRunRequest): Promise<EvaluationRun> {
      const response = await transport.post<JsonApiDocument>(`/evaluations/${datasetId}/run`, {
        records_per_query: data?.recordsPerQuery,
        rerank_enabled: data?.rerankEnabled,
      });
      return decodeOne(response, evaluationRunMapper);
    },

    async get(runId: string): Promise<EvaluationRun> {
      const response = await transport.get<JsonApiDocument>(`/evaluations/runs/${runId}`);
      return decodeOne(response, evaluationRunMapper);
    },

    async list(params?: ListEvaluationRunsParams): Promise<PageResult<EvaluationRun>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.pageSize) queryParams['page_size'] = String(params.pageSize);
      if (params?.datasetId) queryParams['dataset_id'] = params.datasetId;

      const response = await transport.get<unknown>('/evaluations/runs', { params: queryParams });
      return decodePageResult(response, evaluationRunMapper);
    },

    async cancel(runId: string): Promise<EvaluationRun> {
      const response = await transport.post<JsonApiDocument>(`/evaluations/runs/${runId}/cancel`, {});
      return decodeOne(response, evaluationRunMapper);
    },

    async pollUntilComplete(runId: string, options?: PollOptions): Promise<EvaluationRun> {
      const interval = options?.intervalMs ?? 3000;
      const timeout = options?.timeoutMs ?? 300_000;
      const start = Date.now();

      while (true) {
        const run = await service.get(runId);
        options?.onProgress?.(run);

        if (TERMINAL_STATUSES.includes(run.status)) {
          return run;
        }

        if (Date.now() - start > timeout) {
          throw new Error(`Evaluation run ${runId} timed out after ${timeout}ms`);
        }

        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    },
  };

  return service;
}
