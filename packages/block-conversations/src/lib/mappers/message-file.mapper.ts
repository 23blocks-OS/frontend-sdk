import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { MessageFile } from '../types/message-file';
import { parseString, parseDate, parseOptionalNumber } from './utils';

export const messageFileMapper: ResourceMapper<MessageFile> = {
  type: 'MessageFile',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
    conversationUniqueId: parseString(resource.attributes['conversation_unique_id']),
    messageUniqueId: parseString(resource.attributes['message_unique_id']),
    name: parseString(resource.attributes['name']) || '',
    originalName: parseString(resource.attributes['original_name']),
    contentType: parseString(resource.attributes['content_type']),
    size: parseOptionalNumber(resource.attributes['size']),
    url: parseString(resource.attributes['url']),
    thumbnailUrl: parseString(resource.attributes['thumbnail_url']),
    status: parseString(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};
