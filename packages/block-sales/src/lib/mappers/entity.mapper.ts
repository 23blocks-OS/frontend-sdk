import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { SalesEntity } from '../types/entity';
import { parseDate } from './utils';

export const salesEntityMapper: ResourceMapper<SalesEntity> = {
  type: 'entity',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    code: resource.attributes?.['code'] as string | undefined,
    name: resource.attributes?.['name'] as string | undefined,
    email: resource.attributes?.['email'] as string | undefined,
    phone: resource.attributes?.['phone'] as string | undefined,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
