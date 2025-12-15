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
  // WebSocket Token types
  WebSocketToken,
  // Context types
  Context,
  CreateContextRequest,
  UpdateContextRequest,
  ListContextsParams,
  // Notification Settings types
  NotificationSettings,
  UpdateNotificationSettingsRequest,
  // Availability types
  Availability,
  UpdateAvailabilityRequest,
  // Message File types
  MessageFile,
  UploadMessageFileRequest,
  ListMessageFilesParams,
  // Source types
  Source,
  CreateSourceRequest,
  UpdateSourceRequest,
  ListSourcesParams,
  // User types
  ConversationsUser,
  RegisterUserRequest,
  UpdateUserRequest,
  ListUsersParams,
} from './lib/types';

// Services
export type {
  MessagesService,
  DraftMessagesService,
  GroupsService,
  NotificationsService,
  ConversationsService,
  WebSocketTokensService,
  ContextsService,
  NotificationSettingsService,
  AvailabilitiesService,
  MessageFilesService,
  SourcesService,
  UsersService,
} from './lib/services';

export {
  createMessagesService,
  createDraftMessagesService,
  createGroupsService,
  createNotificationsService,
  createConversationsService,
  createWebSocketTokensService,
  createContextsService,
  createNotificationSettingsService,
  createAvailabilitiesService,
  createMessageFilesService,
  createSourcesService,
  createUsersService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  messageMapper,
  draftMessageMapper,
  groupMapper,
  notificationMapper,
  contextMapper,
  messageFileMapper,
  sourceMapper,
  conversationsUserMapper,
} from './lib/mappers';
