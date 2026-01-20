import type { JsonApiResource, JsonApiMapper } from '@23blocks/jsonapi-codec';
import type { LeadFollow } from '../types/lead-follow.js';
import { parseString, parseDate, parseBoolean, parseStatus } from './utils.js';

export const leadFollowMapper: JsonApiMapper<LeadFollow> = {
  type: 'lead_follow',
  map(resource: JsonApiResource): LeadFollow {
    const attrs = resource.attributes || {};
    return {
      id: resource.id,
      uniqueId: parseString(attrs['unique_id']),
      leadUniqueId: parseString(attrs['lead_unique_id']) || '',
      userUniqueId: parseString(attrs['user_unique_id']),
      followType: parseString(attrs['follow_type']),
      scheduledAt: parseDate(attrs['scheduled_at']),
      completedAt: parseDate(attrs['completed_at']),
      notes: parseString(attrs['notes']),
      status: parseStatus(attrs['status']),
      enabled: parseBoolean(attrs['enabled']),
      payload: attrs['payload'] as Record<string, unknown> | undefined,
      createdAt: parseDate(attrs['created_at']),
      updatedAt: parseDate(attrs['updated_at']),
    };
  },
};
