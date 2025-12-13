import type { Transport, BlockConfig, BlockMetadata } from '@23blocks/contracts';
import {
  createMessagesService,
  createDraftMessagesService,
  createGroupsService,
  createNotificationsService,
  createConversationsService,
  type MessagesService,
  type DraftMessagesService,
  type GroupsService,
  type NotificationsService,
  type ConversationsService,
} from './services';

export interface ConversationsBlockConfig extends BlockConfig {
  appId: string;
  tenantId?: string;
}

export interface ConversationsBlock {
  messages: MessagesService;
  draftMessages: DraftMessagesService;
  groups: GroupsService;
  notifications: NotificationsService;
  conversations: ConversationsService;
}

export function createConversationsBlock(
  transport: Transport,
  config: ConversationsBlockConfig
): ConversationsBlock {
  return {
    messages: createMessagesService(transport, config),
    draftMessages: createDraftMessagesService(transport, config),
    groups: createGroupsService(transport, config),
    notifications: createNotificationsService(transport, config),
    conversations: createConversationsService(transport, config),
  };
}

export const conversationsBlockMetadata: BlockMetadata = {
  name: 'conversations',
  version: '0.1.0',
  description: 'Messaging, conversations, groups, and notifications management',
  resourceTypes: [
    'Message',
    'DraftMessage',
    'Group',
    'Notification',
    'Conversation',
  ],
};
