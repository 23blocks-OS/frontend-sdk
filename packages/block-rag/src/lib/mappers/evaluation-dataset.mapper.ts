import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EvaluationDataset } from '../types/evaluation-dataset.js';
import { parseString, parseNumber } from './utils.js';

export const evaluationDatasetMapper: ResourceMapper<EvaluationDataset> = {
  type: 'rag_eval_dataset',

  map(resource: JsonApiResource, _included: IncludedMap): EvaluationDataset {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) || resource.id,
      name: parseString(attrs.name),
      description: attrs.description != null ? parseString(attrs.description) : undefined,
      entityId: attrs.entity_id != null ? parseString(attrs.entity_id) : undefined,
      fileType: attrs.file_type != null ? parseString(attrs.file_type) : undefined,
      totalQuestions: parseNumber(attrs.total_questions),
      tags: Array.isArray(attrs.tags) ? attrs.tags.map(String) : undefined,
      createdBy: attrs.created_by != null ? parseString(attrs.created_by) : undefined,
      createdAt: parseString(attrs.created_at),
      updatedAt: parseString(attrs.updated_at),
    };
  },
};
