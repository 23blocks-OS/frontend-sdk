import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Delegation } from '../types/delegation.js';
import { parseString, parseDate } from './utils.js';

export const delegationMapper: ResourceMapper<Delegation> = {
  type: 'delegation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    delegatorUniqueId: parseString(resource.attributes['delegator_unique_id']) || '',
    delegateUniqueId: parseString(resource.attributes['delegate_unique_id']) || '',
    delegationType: parseString(resource.attributes['delegation_type']) || undefined,
    agentUniqueId: parseString(resource.attributes['agent_unique_id']) || undefined,
    contextUniqueId: parseString(resource.attributes['context_unique_id']) || undefined,
    status: parseString(resource.attributes['status']) || 'active',
    expiresAt: resource.attributes['expires_at'] ? parseDate(resource.attributes['expires_at']) : undefined,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};
