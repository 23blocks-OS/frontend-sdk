import type { Transport, BlockConfig, BlockMetadata, HealthCheckResponse } from '@23blocks/contracts';
import {
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
  type MessagesService,
  type DraftMessagesService,
  type GroupsService,
  type GroupInvitesService,
  type NotificationsService,
  type ConversationsService,
  type WebSocketTokensService,
  type ContextsService,
  type NotificationSettingsService,
  type AvailabilitiesService,
  type MessageFilesService,
  type SourcesService,
  type UsersService,
  type MeetingsService,
  type WebNotificationsService,
} from './services/index.js';

/**
 * Configuration for the Conversations block.
 */
export interface ConversationsBlockConfig extends BlockConfig {
  /** Application ID */
  appId: string;
  /** Tenant ID (optional, for multi-tenant setups) */
  tenantId?: string;
}

/**
 * Messaging and conversations block interface.
 */
export interface ConversationsBlock {
  /** Message CRUD operations */
  messages: MessagesService;
  /** Draft message management */
  draftMessages: DraftMessagesService;
  /** Group chat management */
  groups: GroupsService;
  /** Group invitation management */
  groupInvites: GroupInvitesService;
  /** In-app notification management */
  notifications: NotificationsService;
  /** Conversation thread management */
  conversations: ConversationsService;
  /** WebSocket token generation */
  websocketTokens: WebSocketTokensService;
  /** Conversation context management */
  contexts: ContextsService;
  /** Notification preference management */
  notificationSettings: NotificationSettingsService;
  /** User availability status management */
  availabilities: AvailabilitiesService;
  /** Message file attachment management */
  messageFiles: MessageFilesService;
  /** Message source management */
  sources: SourcesService;
  /** Conversation user management */
  users: UsersService;
  /** Meeting management */
  meetings: MeetingsService;
  /** Web push notification management */
  webNotifications: WebNotificationsService;
  /** Ping the service health endpoint */
  health(): Promise<HealthCheckResponse>;
}

/**
 * Create the Conversations block.
 *
 * @example
 * ```typescript
 * const block = createConversationsBlock(transport, { appId: 'xxx' });
 * const messages = await block.messages.list({ page: 1 });
 * ```
 */
export function createConversationsBlock(
  transport: Transport,
  config: ConversationsBlockConfig
): ConversationsBlock {
  return {
    messages: createMessagesService(transport, config),
    draftMessages: createDraftMessagesService(transport, config),
    groups: createGroupsService(transport, config),
    groupInvites: createGroupInvitesService(transport, config),
    notifications: createNotificationsService(transport, config),
    conversations: createConversationsService(transport, config),
    websocketTokens: createWebSocketTokensService(transport, config),
    contexts: createContextsService(transport, config),
    notificationSettings: createNotificationSettingsService(transport, config),
    availabilities: createAvailabilitiesService(transport, config),
    messageFiles: createMessageFilesService(transport, config),
    sources: createSourcesService(transport, config),
    users: createUsersService(transport, config),
    meetings: createMeetingsService(transport, config),
    webNotifications: createWebNotificationsService(transport, config),
    health: () => transport.get<HealthCheckResponse>('/health'),
  };
}

export const conversationsBlockMetadata: BlockMetadata = {
  name: 'conversations',
  version: '0.1.0',
  description: 'Messaging, conversations, groups, notifications, and real-time communication management',
  resourceTypes: [
    'Message',
    'DraftMessage',
    'Group',
    'GroupInvite',
    'Notification',
    'Conversation',
    'Context',
    'MessageFile',
    'Source',
    'User',
    'Meeting',
    'WebNotification',
  ],
};
