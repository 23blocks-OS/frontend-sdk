import type { ResourceMapper, IncludedMap, JsonApiResource } from '@23blocks/jsonapi-codec';
import type { EvaluationQuestion } from '../types/evaluation-question.js';
import { parseString } from './utils.js';

export const evaluationQuestionMapper: ResourceMapper<EvaluationQuestion> = {
  type: 'rag_eval_question',

  map(resource: JsonApiResource, _included: IncludedMap): EvaluationQuestion {
    const attrs = resource.attributes ?? {};

    return {
      id: resource.id,
      uniqueId: parseString(attrs.unique_id) || resource.id,
      datasetId: parseString(attrs.dataset_id),
      question: parseString(attrs.question),
      groundTruthAnswer: attrs.ground_truth_answer != null ? parseString(attrs.ground_truth_answer) : undefined,
      relevantFileIds: Array.isArray(attrs.relevant_file_ids) ? attrs.relevant_file_ids.map(String) : undefined,
      entityId: attrs.entity_id != null ? parseString(attrs.entity_id) : undefined,
      tags: Array.isArray(attrs.tags) ? attrs.tags.map(String) : undefined,
      createdAt: parseString(attrs.created_at),
      updatedAt: parseString(attrs.updated_at),
    };
  },
};
