import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Onboarding } from '../types/onboarding';
import { parseString, parseDate, parseBoolean, parseStatus, parseObjectArray } from './utils';

export const onboardingMapper: ResourceMapper<Onboarding> = {
  type: 'Onboarding',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    code: parseString(resource.attributes['code']) || '',
    name: parseString(resource.attributes['name']) || '',
    description: parseString(resource.attributes['description']),
    steps: parseObjectArray(resource.attributes['steps']),
    status: parseStatus(resource.attributes['status']),
    enabled: parseBoolean(resource.attributes['enabled']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
