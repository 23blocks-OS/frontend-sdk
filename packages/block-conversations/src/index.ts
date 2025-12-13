// Block factory and metadata
export { createConversationsBlock, conversationsBlockMetadata } from './lib/conversations.block';
export type { ConversationsBlock, ConversationsBlockConfig } from './lib/conversations.block';

// Types
export type {
  // Message types
  Message,
  CreateMessageRequest,
  UpdateMessageRequest,
  ListMessagesParams,
  // Draft Message types
  DraftMessage,
  CreateDraftMessageRequest,
  UpdateDraftMessageRequest,
  ListDraftMessagesParams,
  // Group types
  Group,
  CreateGroupRequest,
  UpdateGroupRequest,
  ListGroupsParams,
  // Notification types
  Notification,
  CreateNotificationRequest,
  UpdateNotificationRequest,
  ListNotificationsParams,
  // Conversation types
  Conversation,
  ConversationFile,
  ConversationMeta,
  GetConversationParams,
} from './lib/types';

// Services
export type {
  MessagesService,
  DraftMessagesService,
  GroupsService,
  NotificationsService,
  ConversationsService,
} from './lib/services';

export {
  createMessagesService,
  createDraftMessagesService,
  createGroupsService,
  createNotificationsService,
  createConversationsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  messageMapper,
  draftMessageMapper,
  groupMapper,
  notificationMapper,
} from './lib/mappers';
