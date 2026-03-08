import type { Transport, PageResult } from '@23blocks/contracts';
import type { JsonApiDocument } from '@23blocks/jsonapi-codec';
import { decodeOne, decodePageResult } from '@23blocks/jsonapi-codec';
import type {
  EvaluationDataset,
  CreateEvaluationDatasetRequest,
  UpdateEvaluationDatasetRequest,
  ListEvaluationDatasetsParams,
} from '../types/evaluation-dataset.js';
import { evaluationDatasetMapper } from '../mappers/evaluation-dataset.mapper.js';
import type { RagBlockConfig } from '../rag.block.js';

export interface EvaluationDatasetsService {
  list(params?: ListEvaluationDatasetsParams): Promise<PageResult<EvaluationDataset>>;
  get(datasetId: string): Promise<EvaluationDataset>;
  create(data: CreateEvaluationDatasetRequest): Promise<EvaluationDataset>;
  update(datasetId: string, data: UpdateEvaluationDatasetRequest): Promise<EvaluationDataset>;
  delete(datasetId: string): Promise<void>;
}

export function createEvaluationDatasetsService(
  transport: Transport,
  _config: RagBlockConfig
): EvaluationDatasetsService {
  return {
    async list(params?: ListEvaluationDatasetsParams): Promise<PageResult<EvaluationDataset>> {
      const queryParams: Record<string, string> = {};
      if (params?.page) queryParams['page'] = String(params.page);
      if (params?.pageSize) queryParams['page_size'] = String(params.pageSize);

      const response = await transport.get<unknown>('/evaluations', { params: queryParams });
      return decodePageResult(response, evaluationDatasetMapper);
    },

    async get(datasetId: string): Promise<EvaluationDataset> {
      const response = await transport.get<JsonApiDocument>(`/evaluations/${datasetId}`);
      return decodeOne(response, evaluationDatasetMapper);
    },

    async create(data: CreateEvaluationDatasetRequest): Promise<EvaluationDataset> {
      const response = await transport.post<JsonApiDocument>('/evaluations', {
        evaluation: {
          name: data.name,
          description: data.description,
          entity_id: data.entityId,
          file_type: data.fileType,
          tags: data.tags,
        },
      });
      return decodeOne(response, evaluationDatasetMapper);
    },

    async update(datasetId: string, data: UpdateEvaluationDatasetRequest): Promise<EvaluationDataset> {
      const response = await transport.put<JsonApiDocument>(`/evaluations/${datasetId}`, {
        evaluation: {
          name: data.name,
          description: data.description,
          tags: data.tags,
        },
      });
      return decodeOne(response, evaluationDatasetMapper);
    },

    async delete(datasetId: string): Promise<void> {
      await transport.delete(`/evaluations/${datasetId}`);
    },
  };
}
