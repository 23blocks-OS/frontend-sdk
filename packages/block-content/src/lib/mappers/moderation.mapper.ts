import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { ContentFlag } from '../types/moderation';
import { parseString, parseDate, parseStatus } from './utils';

export const contentFlagMapper: ResourceMapper<ContentFlag> = {
  type: 'content_flag',
  map: (resource) => ({
    uniqueId: resource.id,
    contentType: (parseString(resource.attributes?.['content_type']) as 'post' | 'comment') ?? 'post',
    contentUniqueId: parseString(resource.attributes?.['content_unique_id']) ?? '',
    reporterUniqueId: parseString(resource.attributes?.['reporter_unique_id']) ?? '',
    reason: parseString(resource.attributes?.['reason']) ?? '',
    category: parseString(resource.attributes?.['category']) as 'spam' | 'harassment' | 'inappropriate' | 'copyright' | 'other' | undefined,
    status: parseStatus(resource.attributes?.['status']),
    createdAt: parseDate(resource.attributes?.['created_at']) ?? new Date(),
    resolvedAt: parseDate(resource.attributes?.['resolved_at']),
    resolvedBy: parseString(resource.attributes?.['resolved_by']),
    resolution: parseString(resource.attributes?.['resolution']),
  }),
};
