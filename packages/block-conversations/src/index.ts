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
  // Group Invite types
  GroupInvite,
  CreateGroupInviteRequest,
  JoinGroupRequest,
  QRCodeResponse,
  ListGroupInvitesParams,
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
  CreateWebSocketTokenRequest,
  CreateWebSocketTokenResponse,
  // Context types
  Context,
  CreateContextRequest,
  UpdateContextRequest,
  ListContextsParams,
  // Notification Settings types
  NotificationSettings,
  UpdateNotificationSettingsRequest,
  // Availability types
  UserAvailability,
  SetAvailabilityRequest,
  // Message File types
  MessageFile,
  CreateMessageFileRequest,
  PresignMessageFileRequest,
  PresignMessageFileResponse,
  ListMessageFilesParams,
  // Source types
  Source,
  // User types
  ConversationsUser,
  RegisterUserRequest,
  UpdateUserRequest,
  ListUsersParams,
  // Meeting types
  Meeting,
  MeetingSession,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  ListMeetingsParams,
  // Web Notification types
  WebNotification,
  CreateWebNotificationRequest,
  BulkWebNotificationRequest,
  ListWebNotificationsParams,
} from './lib/types';

// Services
export type {
  MessagesService,
  DraftMessagesService,
  GroupsService,
  GroupInvitesService,
  NotificationsService,
  ConversationsService,
  WebSocketTokensService,
  ContextsService,
  NotificationSettingsService,
  AvailabilitiesService,
  MessageFilesService,
  SourcesService,
  UsersService,
  MeetingsService,
  WebNotificationsService,
} from './lib/services';

export {
  createMessagesService,
  createDraftMessagesService,
  createGroupsService,
  createGroupInvitesService,
  createNotificationsService,
  createConversationsService,
  createWebSocketTokensService,
  createContextsService,
  createNotificationSettingsService,
  createAvailabilitiesService,
  createMessageFilesService,
  createSourcesService,
  createUsersService,
  createMeetingsService,
  createWebNotificationsService,
} from './lib/services';

// Mappers (for advanced use cases)
export {
  messageMapper,
  draftMessageMapper,
  groupMapper,
  groupInviteMapper,
  notificationMapper,
  contextMapper,
  messageFileMapper,
  sourceMapper,
  conversationsUserMapper,
  meetingMapper,
  webNotificationMapper,
} from './lib/mappers';
