import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Flow } from '../types/flow';
import { parseString, parseDate, parseBoolean, parseStatus, parseObjectArray, parseObject } from './utils';

export const flowMapper: ResourceMapper<Flow> = {
  type: 'Flow',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    onboardingUniqueId: parseString(resource.attributes['onboarding_unique_id']) || '',
    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    steps: parseObjectArray(resource.attributes['steps']),
    conditions: parseObject(resource.attributes['conditions']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
