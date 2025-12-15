import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Cluster, ClusterMember } from '../types/cluster';
import { parseDate } from './utils';

export const clusterMapper: ResourceMapper<Cluster> = {
  type: 'cluster',
  map: (resource) => ({
    id: resource.id,
    uniqueId: resource.attributes?.['unique_id'] as string,
    userUniqueId: resource.attributes?.['user_unique_id'] as string,
    code: resource.attributes?.['code'] as string,
    name: resource.attributes?.['name'] as string,
    description: resource.attributes?.['description'] as string | undefined,
    members: ((resource.attributes?.['members'] as any[]) || []).map((m: any) => ({
      entityUniqueId: m.entity_unique_id,
      role: m.role,
      addedAt: parseDate(m.added_at),
    })) as ClusterMember[],
    enabled: resource.attributes?.['enabled'] as boolean,
    status: resource.attributes?.['status'] as string,
    payload: resource.attributes?.['payload'] as Record<string, unknown> | undefined,
    createdAt: parseDate(resource.attributes?.['created_at']),
    updatedAt: parseDate(resource.attributes?.['updated_at']),
  }),
};
