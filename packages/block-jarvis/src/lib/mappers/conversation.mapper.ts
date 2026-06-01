import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Conversation, ConversationMessage } from '../types/conversation.js';
import { parseString, parseDate } from './utils.js';

export const conversationMapper: ResourceMapper<Conversation> = {
  type: 'Conversation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || '',
    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    // Backend's `name` attribute (Conversations API never had a `title`
    // field — earlier SDK versions read `title` and always got undefined).
    // Fall back to `title` for any deployment still serving the old
    // (incorrect) shape during the transition.
    name: parseString(resource.attributes['name']) ?? parseString(resource.attributes['title']),
    messages: parseMessages(resource.attributes['messages']),
    status: parseString(resource.attributes['status']) || 'active',
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),
  }),
};

function parseMessages(value: unknown): ConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((msg: any) => ({
    role: (msg.role || 'user') as 'user' | 'assistant' | 'system',
    content: parseString(msg.content) || '',
    timestamp: parseDate(msg.timestamp) || new Date(),
  }));
}
