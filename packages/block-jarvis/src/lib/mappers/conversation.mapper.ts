import type { ResourceMapper } from '@23blocks/jsonapi-codec';
import type { Conversation, ConversationMessage } from '../types/conversation';
import { parseString, parseDate, parseStatus, parseMessageRole } from './utils';

export const conversationMapper: ResourceMapper<Conversation> = {
  type: 'Conversation',
  map: (resource) => ({
    id: resource.id,
    uniqueId: parseString(resource.attributes['unique_id']) || resource.id,
    createdAt: parseDate(resource.attributes['created_at']) || new Date(),
    updatedAt: parseDate(resource.attributes['updated_at']) || new Date(),

    agentUniqueId: parseString(resource.attributes['agent_unique_id']),
    userUniqueId: parseString(resource.attributes['user_unique_id']),
    title: parseString(resource.attributes['title']),
    messages: parseMessages(resource.attributes['messages']),
    status: parseStatus(resource.attributes['status']),
    payload: resource.attributes['payload'] as Record<string, unknown> | undefined,
  }),
};

function parseMessages(value: unknown): ConversationMessage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((msg: any) => ({
    role: parseMessageRole(msg.role),
    content: parseString(msg.content) || '',
    timestamp: parseDate(msg.timestamp) || new Date(),
    payload: msg.payload as Record<string, unknown> | undefined,
  }));
}
