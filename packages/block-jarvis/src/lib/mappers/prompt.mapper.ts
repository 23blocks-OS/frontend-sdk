import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Prompt } from '../types/prompt';
import { parseString, parseDate, parseBoolean, parseOptionalNumber, parseStatus, parseStringArray } from './utils';

export const promptMapper: ResourceMapper<Prompt> = {
  type: 'Prompt',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    template: parseString(resource.attributes['template']) || '',
    variables: parseStringArray(resource.attributes['variables']),
    version: parseOptionalNumber(resource.attributes['version']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
