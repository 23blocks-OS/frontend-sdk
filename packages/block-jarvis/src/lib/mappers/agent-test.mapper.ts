import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { AgentTest, AgentTestResult } from '../types/agent-test.js';
import { parseString, parseDate, parseBoolean, parseOptionalNumber } from './utils.js';

export const agentTestMapper: ResourceMapper<AgentTest> = {
  type: 'agent_test',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || '',
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

export const agentTestResultMapper: ResourceMapper<AgentTestResult> = {
  type: 'agent_test_result',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    testUniqueId: parseString(resource.attributes['test_unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || '',
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
