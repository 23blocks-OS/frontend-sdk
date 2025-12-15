import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Entity } from '../types/entity';
import { parseDate } from './utils';

export const entityMapper: ResourceMapper<Entity> = {
  type: 'entity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    code: resource.attributes?.['code'] as string,
    name: resource.attributes?.['name'] as string,
    description: resource.attributes?.['description'] as string | undefined,
    systemPrompt: resource.attributes?.['system_prompt'] as string | undefined,
    model: resource.attributes?.['model'] as string | undefined,
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
