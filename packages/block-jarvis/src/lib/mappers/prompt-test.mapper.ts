import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { PromptTest, PromptTestResult, PromptTestEvaluation } from '../types/prompt-test.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const promptTestMapper: ResourceMapper<PromptTest> = {
  type: 'prompt_test',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']) || undefined,
    input: parseString(resource.attributes['input']) || undefined,
    expectedOutput: parseString(resource.attributes['expected_output']) || undefined,
    variables: resource.attributes['variables'] as Record<string, unknown> | undefined,
    enabled: resource.attributes['enabled'] != null ? parseBoolean(resource.attributes['enabled']) : undefined,
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};

export const promptTestResultMapper: ResourceMapper<PromptTestResult> = {
  type: 'prompt_test_result',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    testUniqueId: parseString(resource.attributes['test_unique_id']) || '',
    promptUniqueId: parseString(resource.attributes['prompt_unique_id']) || '',
    versionUniqueId: parseString(resource.attributes['version_unique_id']) || undefined,
    input: parseString(resource.attributes['input']) || undefined,
    expectedOutput: parseString(resource.attributes['expected_output']) || undefined,
    actualOutput: parseString(resource.attributes['actual_output']) || undefined,
    passed: resource.attributes['passed'] != null ? parseBoolean(resource.attributes['passed']) : undefined,
    score: parseOptionalNumber(resource.attributes['score']),
    tokens: parseOptionalNumber(resource.attributes['tokens']),
    cost: parseOptionalNumber(resource.attributes['cost']),
    duration: parseOptionalNumber(resource.attributes['duration']),
    error: parseString(resource.attributes['error']) || undefined,
    status: parseString(resource.attributes['status']) || 'pending',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};

export const promptTestEvaluationMapper: ResourceMapper<PromptTestEvaluation> = {
  type: 'prompt_test_evaluation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    name: parseString(resource.attributes['name']) || undefined,
    description: parseString(resource.attributes['description']) || undefined,
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
